// ================= ENV =================
require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const materialRoutes = require("./routes/materials");

// ================= APP =================
const app = express();

// ================= STRIPE =================
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ================= ROUTES =================
const quotesRoutes = require("./routes/quotes");
const siteContentRoutes = require("./routes/siteContent");
const chatRoutes = require("./routes/chat");
const simpleOrdersRoutes = require("./routes/SimpleOrders");

// ================= MODELS =================
const Order = require("./models/Order");
const Quote = require("./models/Quote");
const SimpleOrder = require("./models/SimpleOrder");

// ================= UTILS =================
const sendEmail = require("./utils/sendEmail");

// ================= CONFIG =================
const PORT = process.env.PORT || 4242;
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Création automatique du dossier uploads si absent
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

console.log(
  "STRIPE KEY:",
  process.env.STRIPE_SECRET_KEY ? "OK" : "ABSENTE"
);

// ================= DATABASE =================
console.log("🌍 MONGO URI utilisée :", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("📌 Base Mongo utilisée :", mongoose.connection.name);
});

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connecté");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Erreur MongoDB :", err);
});

// =====================================================
// 📦 CONFIG UPLOAD LOCAL
// =====================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [".stl", ".obj", ".3mf", ".step", ".stp"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(new Error("Format de fichier non autorisé"));
    }

    cb(null, true);
  },
});

// =====================================================
// 💳 WEBHOOK STRIPE
// ⚠️ DOIT RESTER AVANT express.json()
// =====================================================
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("📩 WEBHOOK REÇU");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook error:", err.message);
      return res.sendStatus(400);
    }

    try {
      if (event.type !== "checkout.session.completed") {
        return res.sendStatus(200);
      }

      const session = event.data.object;

      const quoteId = session.metadata?.quoteId;
      const orderId = session.metadata?.orderId;
      const simpleOrderId = session.metadata?.simpleOrderId;

      // ================= DEVIS PAYÉ =================
      if (quoteId) {
        const quote = await Quote.findById(quoteId);

        if (!quote) {
          console.error("❌ Devis introuvable :", quoteId);
          return res.sendStatus(404);
        }

        if (quote.paymentStatus === "Payé") {
          return res.sendStatus(200);
        }

        quote.paymentStatus = "Payé";
        quote.status = "En fabrication";
        quote.stripeSessionId = session.id;
        quote.stripePaymentIntentId = session.payment_intent || "";

        await quote.save();

        await sendEmail({
          to: quote.email,
          subject: "Paiement reçu — MecaPrint3D",
          html: `
            <h1>Paiement confirmé</h1>
            <p>Bonjour ${quote.name},</p>
            <p>Nous avons bien reçu votre paiement.</p>
            <p>Votre projet passe maintenant en fabrication.</p>
            <p><strong>Projet :</strong> ${quote.project || "-"}</p>
            <p>Merci pour votre confiance,<br/>MecaPrint3D</p>
          `,
        });

        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Paiement reçu - ${quote.project}`,
            html: `
              <h1>Devis payé</h1>
              <p><strong>Client :</strong> ${quote.name}</p>
              <p><strong>Email :</strong> ${quote.email}</p>
              <p><strong>Projet :</strong> ${quote.project}</p>
              <p><strong>Montant :</strong> ${quote.quoteAmount || 0} €</p>
            `,
          });
        }

        return res.sendStatus(200);
      }

      // ================= COMMANDE RAPIDE PAYÉE =================
      if (simpleOrderId) {
        const simpleOrder = await SimpleOrder.findById(simpleOrderId);

        if (!simpleOrder) {
          console.error("❌ Commande rapide introuvable :", simpleOrderId);
          return res.sendStatus(404);
        }

        if (simpleOrder.paymentStatus === "Payé") {
          return res.sendStatus(200);
        }

        simpleOrder.paymentStatus = "Payé";
        simpleOrder.status = "Payée";
        simpleOrder.stripeSessionId = session.id;
        simpleOrder.stripePaymentIntentId =
          session.payment_intent || "";

        await simpleOrder.save();

        await sendEmail({
          to: simpleOrder.email,
          subject: "Commande rapide confirmée — MecaPrint3D",
          html: `
            <h1>Commande confirmée</h1>
            <p>Bonjour ${simpleOrder.name || ""},</p>
            <p>Nous avons bien reçu votre paiement.</p>
            <p>Votre pièce passe en préparation atelier.</p>
            <p><strong>Matière :</strong> ${simpleOrder.material}</p>
            <p><strong>Taille :</strong> ${simpleOrder.size}</p>
            <p><strong>Quantité :</strong> ${simpleOrder.quantity}</p>
            <p><strong>Total :</strong> ${simpleOrder.totalPrice} €</p>
          `,
        });

        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: "Nouvelle commande rapide payée",
            html: `
              <h1>Commande rapide payée</h1>
              <p><strong>Client :</strong> ${simpleOrder.name || "-"}</p>
              <p><strong>Email :</strong> ${simpleOrder.email}</p>
              <p><strong>Téléphone :</strong> ${simpleOrder.phone || "-"}</p>
              <p><strong>Matière :</strong> ${simpleOrder.material}</p>
              <p><strong>Taille :</strong> ${simpleOrder.size}</p>
              <p><strong>Quantité :</strong> ${simpleOrder.quantity}</p>
              <p><strong>Total :</strong> ${simpleOrder.totalPrice} €</p>
            `,
          });
        }

        return res.sendStatus(200);
      }

      // ================= ANCIENNE COMMANDE =================
      if (orderId) {
        const order = await Order.findOne({ orderId });

        if (!order) {
          console.error("❌ Commande introuvable :", orderId);
          return res.sendStatus(404);
        }

        if (order.status === "paid") {
          return res.sendStatus(200);
        }

        order.status = "paid";
        await order.save();

        await handleOrder(order);

        return res.sendStatus(200);
      }

      console.error("❌ Aucun identifiant dans metadata Stripe");
      return res.sendStatus(400);
    } catch (err) {
      console.error("❌ Erreur traitement webhook :", err);
      return res.sendStatus(500);
    }
  }
);

// =====================================================
// 🌍 CORS
// =====================================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mecaprint3d-fr.vercel.app",
      "https://mecaprint3d.fr",
      "https://www.mecaprint3d.fr",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =====================================================
// BODY PARSERS
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// 📂 ACCÈS PUBLIC AUX FICHIERS UPLOADÉS
// =====================================================
app.use("/uploads", express.static(UPLOAD_DIR));

// =====================================================
// 📂 ROUTE UPLOAD
// =====================================================
app.post("/upload", upload.array("files"), (req, res) => {
  const hostUrl = `${req.protocol}://${req.get("host")}`;

  const files = (req.files || []).map((file) => {
    const relativePath = `uploads/${file.filename}`;

    return {
      name: file.originalname,
      filename: file.filename,
      path: relativePath,
      url: `${hostUrl}/${relativePath}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  console.log("📂 Upload fichiers :", files);

  res.json({ files });
});

// =====================================================
// 🧭 ROUTES API
// =====================================================
app.use("/api/quotes", quotesRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/simple-orders", simpleOrdersRoutes);

// ================= MATERIALS =================
app.use("/api/materials", materialRoutes);

// =====================================================
// 💳 ANCIEN CHECKOUT COMMANDE CLASSIQUE
// =====================================================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { files, email, uploadedFiles } = req.body;

    if (!files || !files.length) {
      return res.status(400).json({ error: "Aucun fichier" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const safeFiles = files.map((file) => ({
      name: file.name,
      price: Number(file.price),
      quantity: Number(file.quantity),
      path: file.path || "",
      url: file.url || "",
    }));

    const total = safeFiles.reduce(
      (sum, file) => sum + file.price * file.quantity,
      0
    );

    if (total <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const orderId = "ORD-" + Date.now();

    await Order.create({
      orderId,
      email,
      items: safeFiles,
      filePaths: uploadedFiles || [],
      total,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: safeFiles.map((file) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: file.name,
          },
          unit_amount: Math.round(file.price * 100),
        },
        quantity: file.quantity,
      })),

      success_url: "https://mecaprint3d.fr/success",
      cancel_url: "https://mecaprint3d.fr/cancel",

      customer_email: email,

      metadata: {
        orderId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("🔥 ERREUR CHECKOUT:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =====================================================
// 📦 TRAITEMENT ANCIENNE COMMANDE
// =====================================================
async function handleOrder(order) {
  try {
    await sendEmail({
      to: order.email,
      subject: "Commande confirmée — MecaPrint3D",
      text: "Votre commande est confirmée et en cours de production.",
    });

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Nouvelle commande ${order.orderId}`,
        text: `
Client: ${order.email}
Total: ${order.total} €

Articles:
${order.items
  .map((item) => "- " + item.name + " x" + item.quantity)
  .join("\n")}
        `,
      });
    }
  } catch (err) {
    console.error("❌ ERREUR COMMANDE:", err);
  }
}

// =====================================================
// 🏠 ROOT
// =====================================================
app.get("/", (req, res) => {
  res.send("API MecaPrint3D OK 🚀");
});

// =====================================================
// 🔥 ERROR HANDLER
// =====================================================
app.use((err, req, res, next) => {
  console.error("🔥 ERREUR API:", err);

  res.status(500).json({
    error: err.message || "Erreur serveur",
  });
});

// =====================================================
// 🚀 START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});