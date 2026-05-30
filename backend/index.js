// ================= ENV =================
require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const chatRoutes = require("./routes/chat");


const app = express();

// ================= STRIPE =================
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ================= ROUTES =================
const quotesRoutes = require("./routes/quotes");
const siteContentRoutes = require("./routes/siteContent");

// ================= MODELS =================
const Order = require("./models/Order");
const Quote = require("./models/Quote");

// ================= UTILS =================
const sendEmail = require("./utils/sendEmail");

// ================= CONFIG =================
const PORT = process.env.PORT || 4242;

console.log(
  "STRIPE KEY:",
  process.env.STRIPE_SECRET_KEY ? "OK" : "ABSENTE"
);

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connecté");
});

// =====================================================
// 📦 UPLOAD LOCAL TEMPORAIRE
// =====================================================
const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      ".stl",
      ".obj",
      ".3mf",
      ".step",
      ".stp",
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(
        new Error("Format de fichier non autorisé")
      );
    }

    cb(null, true);
  },
});

// =====================================================
// 💳 WEBHOOK STRIPE
// ⚠️ DOIT ÊTRE AVANT express.json()
// =====================================================
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("📩 WEBHOOK REÇU");

    const sig = req.headers["stripe-signature"];
    let event;

    // =====================================================
    // 🔐 VÉRIFICATION SIGNATURE STRIPE
    // =====================================================
    try {
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

    // =====================================================
    // 🔄 TRAITEMENT ÉVÉNEMENT
    // =====================================================
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const quoteId = session.metadata?.quoteId;
        const orderId = session.metadata?.orderId;

        // =====================================================
        // 💳 CAS 1 : PAIEMENT D'UN DEVIS
        // =====================================================
        if (quoteId) {
          const quote = await Quote.findById(quoteId);

          if (!quote) {
            console.error("❌ Devis introuvable :", quoteId);
            return res.sendStatus(404);
          }

          // Évite le double traitement webhook
          if (quote.paymentStatus === "Payé") {
            console.log("⚠️ Devis déjà payé");
            return res.sendStatus(200);
          }

          quote.paymentStatus = "Payé";
          quote.status = "En fabrication";
          quote.stripeSessionId = session.id;
          quote.stripePaymentIntentId =
            session.payment_intent || "";

          await quote.save();

          console.log("✅ Devis payé :", quote._id);

          // ================= EMAIL CLIENT =================
          await sendEmail({
            to: quote.email,
            subject: "Paiement reçu — MecaPrint3D",
            html: `
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:30px 0;font-family:Arial,sans-serif;">
                <tr>
                  <td align="center">
                    <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;">
                      <tr>
                        <td style="padding:28px;border-bottom:3px solid #f97316;">
                          <h1 style="margin:0;color:#111827;font-size:24px;">
                            Paiement confirmé
                          </h1>
                          <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
                            MecaPrint3D
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:30px;">
                          <p style="margin:0 0 18px 0;color:#111827;font-size:16px;">
                            Bonjour ${quote.name},
                          </p>

                          <p style="margin:0 0 18px 0;color:#374151;font-size:15px;line-height:1.6;">
                            Nous avons bien reçu votre paiement.
                            Votre projet passe maintenant en fabrication.
                          </p>

                          <p style="margin:0;color:#111827;font-size:14px;">
                            <strong>Projet :</strong> ${quote.project || "-"}
                          </p>

                          <p style="margin:28px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                            Merci pour votre confiance,<br/>
                            L’équipe MecaPrint3D
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `,
          });

          // ================= EMAIL ADMIN =================
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
                <p>Le devis est passé automatiquement en fabrication.</p>
              `,
            });
          }

          return res.sendStatus(200);
        }

        // =====================================================
        // 📦 CAS 2 : ANCIENNE COMMANDE CLASSIQUE
        // =====================================================
        if (orderId) {
          const order = await Order.findOne({ orderId });

          if (!order) {
            console.error("❌ Commande introuvable :", orderId);
            return res.sendStatus(404);
          }

          if (order.status === "paid") {
            console.log("⚠️ Commande déjà traitée");
            return res.sendStatus(200);
          }

          order.status = "paid";
          await order.save();

          await handleOrder(order);

          return res.sendStatus(200);
        }

        console.error("❌ Aucun quoteId ni orderId dans metadata");
        return res.sendStatus(400);
      }

      // Événement Stripe reçu mais non utilisé
      return res.sendStatus(200);
    } catch (err) {
      console.error("❌ Erreur traitement webhook :", err);
      return res.sendStatus(500);
    }
  }
);

// =====================================================
// 🌍 MIDDLEWARES
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

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// 📂 STATIC FILES ACCESS
// =====================================================
// Permet d'accéder aux fichiers uploadés :
// /uploads/chat/monfichier.stl
// /uploads/image.png
// =====================================================
app.use(
  "/uploads",
  express.static("uploads")
);

// =====================================================
// 🧭 ROUTES API
// =====================================================
app.use("/api/quotes", quotesRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/chat", chatRoutes);

// =====================================================
// 📂 UPLOAD LOCAL
// =====================================================
app.post(
  "/upload",
  upload.array("files"),
  (req, res) => {
    const files = req.files.map((file) => ({
      name: file.originalname,
      path: file.path,
    }));

    console.log("📂 Upload:", files);

    res.json({ files });
  }
);

// =====================================================
// 💳 ANCIEN CHECKOUT COMMANDE CLASSIQUE
// =====================================================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { files, email, uploadedFiles } = req.body;

    if (!files || !files.length) {
      return res.status(400).json({
        error: "Aucun fichier",
      });
    }

    if (!email) {
      return res.status(400).json({
        error: "Email requis",
      });
    }

    const safeFiles = files.map((file) => ({
      name: file.name,
      price: Number(file.price),
      quantity: Number(file.quantity),
    }));

    const total = safeFiles.reduce(
      (sum, file) =>
        sum + file.price * file.quantity,
      0
    );

    if (total <= 0) {
      return res.status(400).json({
        error: "Montant invalide",
      });
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

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items: safeFiles.map((file) => ({
          price_data: {
            currency: "eur",

            product_data: {
              name: file.name,
            },

            unit_amount: Math.round(
              file.price * 100
            ),
          },

          quantity: file.quantity,
        })),

        success_url:
          "https://mecaprint3d.fr/success",

        cancel_url:
          "https://mecaprint3d.fr/cancel",

        customer_email: email,

        metadata: {
          orderId,
        },
      });

    res.json({
      url: session.url,
    });
  } catch (err) {
    console.error("🔥 ERREUR CHECKOUT:", err);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =====================================================
// 📦 TRAITEMENT ANCIENNE COMMANDE
// =====================================================
async function handleOrder(order) {
  try {
    console.log("📦 Traitement commande :", order.orderId);

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

    console.log("✅ Commande terminée");
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
    error: "Erreur serveur",
  });
});

// =====================================================
// 🚀 START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});