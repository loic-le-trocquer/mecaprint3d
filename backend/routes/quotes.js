const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Quote = require("../models/Quote");

const sendEmail = require("../utils/sendEmail");
const generateQuotePdf = require("../utils/generateQuotePdf");

const router = express.Router();

// =====================================================
// ☁️ CLOUDINARY CONFIG
// =====================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// 📦 MULTER CONFIG
// =====================================================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// =====================================================
// ☁️ UPLOAD CLOUDINARY
// =====================================================
function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "mecaprint3d/devis",
          resource_type: "auto",
        },

        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

    streamifier
      .createReadStream(file.buffer)
      .pipe(stream);
  });
}

// =====================================================
// 🔐 ADMIN MIDDLEWARE
// =====================================================
function requireAdmin(req, res, next) {
  const auth =
    req.headers.authorization || "";

  const headerToken =
    auth.replace("Bearer ", "");

  const queryToken =
    req.query.token;

  const token =
    headerToken || queryToken;

  if (
    !token ||
    token !== process.env.ADMIN_TOKEN
  ) {
    return res.status(401).json({
      success: false,
      error: "Accès non autorisé",
    });
  }

  next();
}

// =====================================================
// 📋 LISTE DES DEVIS
// GET /api/quotes
// =====================================================
router.get("/", requireAdmin, async (req, res) => {
  try {
    const quotes = await Quote.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quotes,
    });

  } catch (error) {

    console.error(
      "❌ Erreur récupération devis :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });

  }
});

// =====================================================
// ✏️ UPDATE QUOTE
// PUT /api/quotes/:id
// =====================================================
router.put("/:id", requireAdmin, async (req, res) => {

  try {

    // =====================================================
    // FIND EXISTING QUOTE
    // =====================================================
    const existingQuote =
      await Quote.findById(req.params.id);

    if (!existingQuote) {

      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });

    }

    // =====================================================
    // OLD STATUS
    // =====================================================
    const oldStatus =
      existingQuote.status;

    // =====================================================
    // UPDATE FIELDS
    // =====================================================
    existingQuote.status =
      req.body.status;

    existingQuote.adminNotes =
      req.body.adminNotes;

    existingQuote.archived =
      req.body.archived;

    existingQuote.quoteLines =
      req.body.quoteLines;

    existingQuote.quoteAmount =
      req.body.quoteAmount;

    existingQuote.quoteDelay =
      req.body.quoteDelay;

    existingQuote.quoteComment =
      req.body.quoteComment;

    // =====================================================
    // 📅 DATE ENVOI DEVIS
    // =====================================================
    if (
      req.body.status === "Devis envoyé" &&
      oldStatus !== "Devis envoyé"
    ) {
      existingQuote.quoteSentAt =
        new Date();
    }

    // =====================================================
    // SAVE
    // =====================================================
    await existingQuote.save();

    // =====================================================
    // 📧 EMAIL AUTOMATIQUE CHANGEMENT STATUT
    // =====================================================
    if (
      req.body.status &&
      req.body.status !== oldStatus
    ) {

      const statusLabels = {

        "Nouveau":
          "Nouveau devis reçu",

        "En analyse":
          "Projet en cours d’étude",

        "Devis envoyé":
          "Votre devis est disponible",

        "En fabrication":
          "Projet en fabrication",

        "Terminé":
          "Projet terminé",

        "Refusé":
          "Projet clôturé",

      };

      const statusMessages = {

        "Nouveau":
          "Votre demande a bien été enregistrée.",

        "En analyse":
          "Votre projet est actuellement en cours d’analyse par notre atelier.",

        "Devis envoyé":
          "Votre devis est maintenant disponible.",

        "En fabrication":
          "Votre projet est actuellement en fabrication.",

        "Terminé":
          "Votre projet est terminé et prêt.",

        "Refusé":
          "Votre demande a été clôturée.",

      };

      // =====================================================
      // SEND EMAIL
      // =====================================================
      await sendEmail({

        to: existingQuote.email,

        subject:
          `Mise à jour de votre projet - ${statusLabels[existingQuote.status]}`,

        html: `
        <div style="font-family:Arial,sans-serif;background:#f4f4f5;padding:40px;">

          <div style="max-width:620px;margin:auto;background:#18181b;border-radius:24px;overflow:hidden;border:1px solid #27272a;">

            <div style="padding:40px;background:linear-gradient(135deg,#f97316,#ea580c);">

              <img
                src="https://mecaprint3d.fr/logo-mail.jpg"
                width="280"
                alt="MecaPrint3D"
              />

            </div>

            <div style="padding:40px;color:#e4e4e7;">

              <h1 style="margin-top:0;color:white;">
                Bonjour ${existingQuote.name},
              </h1>

              <p style="font-size:16px;line-height:1.7;color:#d4d4d8;">
                ${statusMessages[existingQuote.status]}
              </p>

              <div style="margin-top:30px;padding:24px;background:#09090b;border-radius:18px;border:1px solid #27272a;">

                <p>
                  <strong>Projet :</strong>
                  ${existingQuote.project}
                </p>

                <p>
                  <strong>Statut :</strong>
                  ${statusLabels[existingQuote.status]}
                </p>

              </div>

              ${
                existingQuote.status === "Devis envoyé"
                  ? `
                    <div style="margin-top:35px;text-align:center;">

                      <a
                        href="https://mecaprint3d.fr/commande/${existingQuote._id}"
                        style="
                          display:inline-block;
                          background:#f97316;
                          color:white;
                          text-decoration:none;
                          padding:16px 28px;
                          border-radius:14px;
                          font-weight:800;
                        "
                      >
                        Commander / Régler le devis
                      </a>

                    </div>
                  `
                  : ""
              }

            </div>

          </div>

        </div>
        `,
      });

    }

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({
      success: true,
      quote: existingQuote,
    });

  } catch (error) {

    console.error(
      "❌ Erreur mise à jour devis :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });

  }

});

// =====================================================
// 📄 PDF DEVIS
// GET /api/quotes/:id/pdf
// =====================================================
router.get("/:id/pdf", requireAdmin, async (req, res) => {

  try {

    const quote =
      await Quote.findById(req.params.id)
        .lean();

    if (!quote) {

      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });

    }

    generateQuotePdf(res, quote);

  } catch (error) {

    console.error(
      "❌ Erreur génération PDF :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur génération PDF",
    });

  }

});

// =====================================================
// 📩 CREATE QUOTE
// POST /api/quotes
// =====================================================
router.post(
  "/",

  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]),

  async (req, res) => {

    try {

      let uploadedFiles = [];

      const receivedFiles = [
        ...(req.files?.file || []),
        ...(req.files?.files || []),
      ];

      // =====================================================
      // ☁️ CLOUDINARY UPLOAD
      // =====================================================
      if (receivedFiles.length) {

        uploadedFiles = await Promise.all(

          receivedFiles.map(async (file) => {

            const result =
              await uploadToCloudinary(file);

            return {
              originalName: file.originalname,
              filename: result.public_id,
              path: result.secure_url,
              mimetype: file.mimetype,
              size: file.size,
            };

          })

        );

      }

      // =====================================================
      // 💾 SAVE QUOTE
      // =====================================================
      const quote = await Quote.create({
        ...req.body,
        files: uploadedFiles,
      });

      console.log(
        "📩 Nouveau devis :",
        quote._id
      );

      // =====================================================
      // 📧 EMAIL CLIENT
      // =====================================================
      await sendEmail({
        to: quote.email,
        subject:
          "Votre demande de devis MecaPrint3D",

        html: `
          <h1>Bonjour ${quote.name}</h1>

          <p>
            Votre demande de devis a bien été reçue.
          </p>
        `,
      });

      // =====================================================
      // 📧 EMAIL ADMIN
      // =====================================================
      await sendEmail({

        to: process.env.ADMIN_EMAIL,

        subject:
          `Nouvelle demande - ${quote.project}`,

        html: `
          <h1>Nouvelle demande</h1>

          <p>
            <strong>Client :</strong>
            ${quote.name}
          </p>
        `,
      });

      // =====================================================
      // RESPONSE
      // =====================================================
      res.json({
        success: true,
        quote,
      });

    } catch (error) {

      console.error(
        "❌ Erreur devis :",
        error
      );

      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });

    }

  }
);

// =====================================================
// 💳 STRIPE CHECKOUT
// POST /api/quotes/:id/checkout
// =====================================================
router.post("/:id/checkout", async (req, res) => {

  try {

    const quote =
      await Quote.findById(req.params.id);

    if (!quote) {

      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });

    }

    const lines =
      quote.quoteLines || [];

    if (!lines.length) {

      return res.status(400).json({
        success: false,
        error: "Aucune ligne de devis",
      });

    }

    // =====================================================
    // CREATE STRIPE SESSION
    // =====================================================
    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        mode: "payment",

        customer_email:
          quote.email,

        line_items:
          lines.map((line) => ({

            price_data: {

              currency: "eur",

              product_data: {
                name:
                  line.label ||
                  "Prestation MecaPrint3D",
              },

              unit_amount:
                Math.round(
                  Number(
                    line.unitPrice || 0
                  ) * 100
                ),

            },

            quantity:
              Number(
                line.quantity || 1
              ),

          })),

        success_url:
          "https://mecaprint3d.fr/success",

        cancel_url:
          "https://mecaprint3d.fr/cancel",

        metadata: {
          quoteId:
            String(quote._id),
        },

      });

    // =====================================================
    // SAVE STRIPE SESSION
    // =====================================================
    quote.stripeSessionId =
      session.id;

    quote.paymentStatus =
      "En attente";

    await quote.save();

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({
      success: true,
      url: session.url,
    });

  } catch (error) {

    console.error(
      "❌ Erreur checkout devis :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur Stripe",
    });

  }

});

module.exports = router;