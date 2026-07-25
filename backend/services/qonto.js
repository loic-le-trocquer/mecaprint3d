const crypto = require("crypto");
const QontoConnection = require("../models/QontoConnection");

const SCOPES = [
  "offline_access",
  "client.read",
  "client.write",
  "client_invoice.write",
  "client_invoices.read",
].join(" ");

function config() {
  const sandbox = process.env.QONTO_ENV !== "production";
  return {
    sandbox,
    clientId: process.env.QONTO_CLIENT_ID,
    clientSecret: process.env.QONTO_CLIENT_SECRET,
    redirectUri: process.env.QONTO_REDIRECT_URI,
    stagingToken: process.env.QONTO_STAGING_TOKEN,
    oauthBase: sandbox
      ? "https://oauth-sandbox.staging.qonto.co"
      : "https://oauth.qonto.com",
    apiBase: sandbox
      ? "https://thirdparty-sandbox.staging.qonto.co"
      : "https://thirdparty.qonto.com",
  };
}

function assertConfigured() {
  const current = config();
  const missing = [
    ["QONTO_CLIENT_ID", current.clientId],
    ["QONTO_CLIENT_SECRET", current.clientSecret],
    ["QONTO_REDIRECT_URI", current.redirectUri],
    ["QONTO_TOKEN_ENCRYPTION_KEY", process.env.QONTO_TOKEN_ENCRYPTION_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (current.sandbox && !current.stagingToken) {
    missing.push("QONTO_STAGING_TOKEN");
  }
  if (missing.length) {
    throw new Error(`Configuration Qonto incomplète : ${missing.join(", ")}`);
  }
  return current;
}

function encryptionKey() {
  return crypto
    .createHash("sha256")
    .update(process.env.QONTO_TOKEN_ENCRYPTION_KEY)
    .digest();
}

function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((item) => item.toString("base64")).join(".");
}

function decrypt(value) {
  const [iv, tag, encrypted] = value
    .split(".")
    .map((item) => Buffer.from(item, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}

function oauthHeaders(current, includeContentType = false) {
  const headers = {};
  if (includeContentType) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  if (current.sandbox) {
    headers["X-Qonto-Staging-Token"] = current.stagingToken;
  }
  return headers;
}

function createState() {
  const payload = Buffer.from(
    JSON.stringify({
      nonce: crypto.randomBytes(18).toString("hex"),
      exp: Date.now() + 10 * 60 * 1000,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.QONTO_TOKEN_ENCRYPTION_KEY)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function validateState(state) {
  if (!state || !state.includes(".")) return false;
  const [payload, signature] = state.split(".");
  const expected = crypto
    .createHmac("sha256", process.env.QONTO_TOKEN_ENCRYPTION_KEY)
    .update(payload)
    .digest("base64url");
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  return Number(parsed.exp) > Date.now();
}

function authorizationUrl() {
  const current = assertConfigured();
  const params = new URLSearchParams({
    client_id: current.clientId,
    redirect_uri: current.redirectUri,
    response_type: "code",
    scope: SCOPES,
    state: createState(),
  });
  return `${current.oauthBase}/oauth2/auth?${params.toString()}`;
}

async function tokenRequest(body) {
  const current = assertConfigured();
  const response = await fetch(`${current.oauthBase}/oauth2/token`, {
    method: "POST",
    headers: oauthHeaders(current, true),
    body: new URLSearchParams(body),
    redirect: "manual",
  });
  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Réponse OAuth Qonto invalide (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(
      data.error_description || data.error || `Erreur OAuth Qonto ${response.status}`
    );
  }
  return data;
}

async function saveTokens(tokens, previousRefreshToken = "") {
  const refreshToken = tokens.refresh_token || previousRefreshToken;
  if (!tokens.access_token || !refreshToken) {
    throw new Error("Jetons OAuth Qonto incomplets");
  }
  const expiresIn = Number(tokens.expires_in || 7200);
  await QontoConnection.findOneAndUpdate(
    { key: "mecaprint3d" },
    {
      key: "mecaprint3d",
      accessToken: encrypt(tokens.access_token),
      refreshToken: encrypt(refreshToken),
      expiresAt: new Date(Date.now() + Math.max(60, expiresIn - 60) * 1000),
      scopes: tokens.scope || SCOPES,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function exchangeAuthorizationCode(code) {
  const current = assertConfigured();
  const tokens = await tokenRequest({
    grant_type: "authorization_code",
    code,
    client_id: current.clientId,
    client_secret: current.clientSecret,
    redirect_uri: current.redirectUri,
  });
  await saveTokens(tokens);
}

async function accessToken() {
  const current = assertConfigured();
  const connection = await QontoConnection.findOne({ key: "mecaprint3d" });
  if (!connection) {
    throw new Error("Qonto n’est pas encore connecté");
  }
  if (connection.expiresAt.getTime() > Date.now()) {
    return decrypt(connection.accessToken);
  }
  const previousRefreshToken = decrypt(connection.refreshToken);
  const tokens = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: previousRefreshToken,
    client_id: current.clientId,
    client_secret: current.clientSecret,
  });
  await saveTokens(tokens, previousRefreshToken);
  return tokens.access_token;
}

async function apiRequest(path, options = {}) {
  const current = assertConfigured();
  const token = await accessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (current.sandbox) {
    headers["X-Qonto-Staging-Token"] = current.stagingToken;
  }
  const response = await fetch(`${current.apiBase}${path}`, {
    ...options,
    headers,
    redirect: "manual",
  });
  const raw = await response.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`Réponse Qonto invalide (${response.status})`);
    }
  }
  if (!response.ok) {
    const detail =
      data?.errors?.[0]?.detail ||
      data?.error_description ||
      data?.message ||
      data?.error ||
      `Erreur Qonto ${response.status}`;
    throw new Error(detail);
  }
  return data;
}

async function findOrCreateClient(quote) {
  const list = await apiRequest(
    `/v2/clients?filter[email]=${encodeURIComponent(quote.email)}`
  );
  const clients = list.clients || list.data || [];
  if (clients.length) return clients[0];

  const nameParts = String(quote.name || "").trim().split(/\s+/);
  const firstName = nameParts.shift() || "Client";
  const lastName = nameParts.join(" ") || "MecaPrint3D";
  const payload = {
    first_name: firstName,
    last_name: lastName,
    kind: "individual",
    name: quote.name,
    email: quote.email,
    currency: "EUR",
    locale: "fr",
    billing_address: {
      street_address: quote.address,
      city: quote.city,
      zip_code: quote.zipCode,
      country_code: "FR",
    },
  };
  const created = await apiRequest("/v2/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return created.client || created.data || created;
}

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function syncQuoteRequest(quote) {
  if (!quote.address || !quote.city || !quote.zipCode) {
    throw new Error("Adresse client incomplète pour Qonto");
  }
  const client = await findOrCreateClient(quote);
  const clientId = client.id || client.attributes?.id;
  if (!clientId) throw new Error("Identifiant client Qonto introuvable");

  const created = await apiRequest("/v2/quotes", {
    method: "POST",
    body: JSON.stringify({
      client_id: clientId,
      issue_date: isoDate(),
      expiry_date: isoDate(30),
      terms_and_conditions:
        "Demande initiale à chiffrer. Le tarif sera confirmé après étude du projet.",
      currency: "EUR",
      header: "DEMANDE À CHIFFRER",
      items: [
        {
          title: quote.project || "Projet sur mesure MecaPrint3D",
          description: [
            quote.message,
            `Matière : ${quote.material || "À définir"}`,
            `Référence : ${quote.quoteNumber || quote._id}`,
          ]
            .filter(Boolean)
            .join("\n"),
          quantity: String(quote.quantity || 1),
          unit: "piece",
          currency: "EUR",
          unit_price: { value: "0.00", currency: "EUR" },
          vat_rate: "0.2",
        },
      ],
    }),
  });
  return {
    clientId,
    quoteId: created.id || created.quote?.id || created.data?.id,
    quoteUrl: created.quote_url || created.quote?.quote_url || "",
  };
}

async function connectionStatus() {
  const connection = await QontoConnection.findOne({ key: "mecaprint3d" });
  return {
    configured: Boolean(
      process.env.QONTO_CLIENT_ID &&
        process.env.QONTO_CLIENT_SECRET &&
        process.env.QONTO_REDIRECT_URI
    ),
    connected: Boolean(connection),
    environment: process.env.QONTO_ENV || "sandbox",
  };
}

module.exports = {
  authorizationUrl,
  validateState,
  exchangeAuthorizationCode,
  syncQuoteRequest,
  connectionStatus,
};
