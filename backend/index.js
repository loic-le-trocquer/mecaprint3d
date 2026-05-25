// ================= ENV =================
require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");
const app = express();

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

console.log(
  "STRIPE KEY:",
  process.env.STRIPE_SECRET_KEY ? "OK" : "ABSENTE"
);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const multer = require("multer");
const quotesRoutes = require("./routes/quotes");
const siteContentRoutes = require("./routes/siteContent");

// ================= CONFIG =================
const PORT = process.env.PORT || 4242;

// ================= MODELS =================
const Order = require("./models/Order");
const Quote = require("./models/Quote");

// ================= UTILS =================
// const createInvoice = require("./utils/createInvoice");
const sendEmail = require("./utils/sendEmail");
// const saveInvoice = require("./utils/saveInvoice");
// const generateInvoiceNumber = require("./utils/invoiceNumber");

// const generateDocument = require("./utils/generateDocument");
const generateQuotePdf = require("./utils/generateQuotePdf");

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connecté");
});

// ================= STORAGE FILES =================
// 👉 stockage local des fichiers uploadés
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      ".stl",
      ".obj",
      ".3mf",
      ".step",
      ".stp"
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(new Error("Format de fichier non autorisé"));
    }

    cb(null, true);
  }
});

// ================= WEBHOOK STRIPE =================
// ⚠️ DOIT ÊTRE AVANT express.json()
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("📩 WEBHOOK REÇU");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // 🔐 vérification signature Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("🔥 EVENT:", event.type);

  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.sendStatus(400);
  }

  try {
    // ✅ paiement terminé
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ orderId manquant");
        return res.sendStatus(400);
      }

      // 🔍 récupération commande
      const order = await Order.findOne({ orderId });

      if (!order) {
        console.error("❌ commande introuvable");
        return res.sendStatus(404);
      }

      // ⚠️ éviter double traitement
      if (order.status === "paid") {
        console.log("⚠️ déjà traité");
        return res.sendStatus(200);
      }

      // 🔄 mise à jour statut
      order.status = "paid";
      await order.save();

      // 📦 traitement complet
      await handleOrder(order);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("🔥 ERREUR WEBHOOK:", err);
    res.sendStatus(500);
  }
});

// ================= MIDDLEWARE =================
app.use(cors({
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
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/quotes", quotesRoutes);
app.use("/api/site-content", siteContentRoutes);

// ================= UPLOAD =================
// 👉 upload fichiers avant paiement
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files.map(f => ({
    name: f.originalname,
    path: f.path
  }));

  console.log("📂 Upload:", files);

  res.json({ files });
});

// ================= CHECKOUT =================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { files, email, uploadedFiles } = req.body;

    // 🔒 validation
    if (!files || !files.length) {
      return res.status(400).json({ error: "Aucun fichier" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    // 🔐 nettoyage données
    const safeFiles = files.map(f => ({
      name: f.name,
      price: Number(f.price),
      quantity: Number(f.quantity)
    }));

    // 💰 calcul total
    const total = safeFiles.reduce(
      (sum, f) => sum + f.price * f.quantity,
      0
    );

    if (total <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // 🆔 ID commande unique
    const orderId = "ORD-" + Date.now();

    // 💾 sauvegarde DB
    await Order.create({
      orderId,
      email,
      items: safeFiles,
      filePaths: uploadedFiles || [],
      total,
      status: "pending"
    });

    console.log("🧾 Commande créée:", orderId);

    // 💳 Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
    
      line_items: safeFiles.map(f => ({
        price_data: {
          currency: "eur",
          product_data: { name: f.name },
          unit_amount: Math.round(f.price * 100)
        },
        quantity: f.quantity
      })),
    
      success_url: "https://mecaprint3d-fr.vercel.app/success",
      cancel_url: "https://mecaprint3d-fr.vercel.app/cancel",
    
      // ✅ PRÉREMPLISSAGE EMAIL
      customer_email: email,
    
      metadata: { orderId }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("🔥 ERREUR CHECKOUT:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ================= DEVIS =================
app.post("/create-quote", async (req, res) => {
  try {
    console.log("🔥 ROUTE CREATE-QUOTE EXECUTÉE");
    console.log("📩 BODY RECU:", req.body);

    const { files, email, name, material, description } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Nom et email requis" });
    }

    const quoteId = "Q-" + Date.now();

    const safeFiles = (files || []).map(f => ({
      name: f.name || "Fichier",
      quantity: Number(f.quantity) || 1,
      price: Number(f.price) || 0
    }));

    const total = safeFiles.reduce(
      (sum, f) => sum + f.price * f.quantity,
      0
    );

    await Quote.create({
      quoteId,
      email,
      name,
      material: material || "Non précisée",
      description: description || "",
      files: safeFiles,
      total
    });

    // ================= PDF DEVIS PREMIUM =================
    const quotesDir = path.join(__dirname, "quotes");
    if (!fs.existsSync(quotesDir)) fs.mkdirSync(quotesDir);

    const quotePdfPath = path.join(quotesDir, `${quoteId}.pdf`);

    await generateQuotePdf({
      number: quoteId,
      quoteId,
      client: { name, email },
      project: {
        service: "Demande de devis impression 3D",
        technology: "À définir",
        material: material || "À définir",
        finish: "À confirmer",
        description: description || "Non précisée",
      },
      items: safeFiles.map((f) => ({
        label: f.name,
        details: `Fichier transmis — quantité ${f.quantity}`,
        quantity: f.quantity,
        unitPrice: f.price,
      })),
      files: safeFiles,
      grossAmount: total,
      discountAmount: 0,
      finalAmount: total,
      delay: "À confirmer après analyse technique",
    }, quotePdfPath);

    await sendEmail({
      to: email,
      subject: "Demande de devis reçue — MecaPrint3D",
      text: `Bonjour ${name},

Nous avons bien reçu votre demande de devis.

Référence : ${quoteId}
Matière : ${material || "Non précisée"}
Description : ${description || "Non précisée"}

Nous vous répondons sous 24h.

MecaPrint3D`,
      attachments: [
        { filename: `devis-${quoteId}.pdf`, path: quotePdfPath }
      ]
    });

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Nouveau devis ${quoteId}`,
        text: `Nouveau devis reçu

Référence : ${quoteId}
Client : ${name}
Email : ${email}
Matière : ${material || "Non précisée"}
Description : ${description || "Non précisée"}

Fichiers :
${safeFiles.map(f => `- ${f.name} x${f.quantity}`).join("\n")}

Total estimé : ${total} €`
      });
    }

    console.log("✅ DEVIS OK:", quoteId);

    res.json({ success: true, quoteId });

  } catch (err) {
    console.error("❌ ERREUR CREATE-QUOTE:", err);
    res.status(500).json({ error: "Erreur envoi devis" });
  }
});

// ================= TRAITEMENT COMMANDE =================
async function handleOrder(order) {
  try {
    console.log("📦 Traitement:", order.orderId);

    const invoiceNumber = await generateInvoiceNumber();

    const invoicesDir = path.join(__dirname, "invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

    const filePath = path.join(invoicesDir, `${invoiceNumber}.pdf`);

    // 📄 génération facture
    /*
    await createInvoice({
      customer: order.email,
      email: order.email,
      items: order.items,
      total: order.total,
      invoiceNumber
    }, filePath);
   
    await saveInvoice({
      invoiceNumber,
      email: order.email,
      total: order.total
    });
 */
    console.log("📄 Facture OK");

    // ================= EMAIL CLIENT =================
    await sendEmail({
      to: order.email,
      subject: "✅ Commande confirmée — Mecaprint3D",
      text: "Votre commande est confirmée et en cours de production.",
      orderId: order.orderId,
      attachments: [
        { filename: "facture.pdf", path: filePath }
      ]
    });

    console.log("📧 Client OK");

    // ================= EMAIL ADMIN =================
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Nouvelle commande ${order.orderId}`,
        text: `
Client: ${order.email}
Total: ${order.total} €

Fichiers:
${(order.filePaths || []).map(f => "- " + f.name).join("\n")}

Articles:
${order.items.map(i => "- " + i.name + " x" + i.quantity).join("\n")}
        `
      });

      console.log("📧 Admin OK");
    }

    console.log("✅ Commande terminée");

  } catch (err) {
    console.error("❌ ERREUR COMMANDE:", err);
  }
}

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API MecaPrint3D OK 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERREUR API:", err);

  res.status(500).json({
    error: "Erreur serveur"
  });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});