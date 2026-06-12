const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
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
// 🔢 GÉNÉRATION NUMÉRO DE DEVIS
// Format : MP3D-2026-0001
// Le compteur se base uniquement sur les devis déjà numérotés
// =====================================================
async function generateQuoteNumber() {
  const year = new Date().getFullYear();

  const count = await Quote.countDocuments({
    quoteNumber: {
      $regex: `^MP3D-${year}-`,
    },
  });

  const number = String(count + 1).padStart(4, "0");

  return `MP3D-${year}-${number}`;
}


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
// 🔢 NUMÉRO DE DEVIS SI ABSENT
// Utile pour les anciens devis déjà créés
// =====================================================
if (!existingQuote.quoteNumber) {

  existingQuote.quoteNumber =
    await generateQuoteNumber();

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
  existingQuote.quoteSentAt = new Date();

  existingQuote.publicAccessToken =
    crypto.randomBytes(32).toString("hex");

  existingQuote.publicAccessTokenExpiresAt =
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
      // 🔗 LIEN PUBLIC PDF
      // =====================================================
const publicPdfUrl =
  `https://mecaprint3d-backend.onrender.com/api/quotes/${existingQuote._id}/public-pdf?token=${existingQuote.publicAccessToken}`;

// =====================================================
// SEND EMAIL
// =====================================================
await sendEmail({

        to: existingQuote.email,

        subject:
  existingQuote.status === "Devis envoyé"
    ? `Votre devis MecaPrint3D ${existingQuote.quoteNumber || ""}`
    : `Mise à jour de votre projet - ${statusLabels[existingQuote.status]}`,

        html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:30px 0;font-family:Arial,sans-serif;">
  <tr>
    <td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:28px;border-bottom:3px solid #f97316;">
            <h1 style="margin:0;color:#111827;font-size:24px;">
              MecaPrint3D
            </h1>
            <p style="margin:6px 0 0 0;color:#6b7280;font-size:14px;">
              Suivi de votre projet
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">
            <p style="margin:0 0 18px 0;color:#111827;font-size:16px;">
              Bonjour ${existingQuote.name},
            </p>

            <p style="margin:0 0 22px 0;color:#374151;font-size:15px;line-height:1.6;">
  ${
    existingQuote.status === "Devis envoyé"
      ? `Votre devis n° <strong>${existingQuote.quoteNumber || "-"}</strong>
         est disponible. Vous pouvez le consulter, le télécharger et valider votre commande en ligne.`
      : statusMessages[existingQuote.status]
  }
</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;">
             <tr>
  <td style="padding:12px;background:#f9fafb;color:#6b7280;font-size:13px;width:160px;">
    N° devis
  </td>
  <td style="padding:12px;color:#111827;font-size:13px;">
    ${existingQuote.quoteNumber || "-"}
  </td>
</tr>

<tr>
  <td style="padding:12px;background:#f9fafb;color:#6b7280;font-size:13px;width:160px;border-top:1px solid #e5e7eb;">
    Projet
  </td>
  <td style="padding:12px;color:#111827;font-size:13px;border-top:1px solid #e5e7eb;">
    ${existingQuote.project || "-"}
  </td>
</tr>

<tr>
  <td style="padding:12px;background:#f9fafb;color:#6b7280;font-size:13px;width:160px;border-top:1px solid #e5e7eb;">
    Statut
  </td>
  <td style="padding:12px;color:#111827;font-size:13px;border-top:1px solid #e5e7eb;">
    ${statusLabels[existingQuote.status] || existingQuote.status}
  </td>
</tr>
            </table>

            ${
 existingQuote.status === "Devis envoyé"
  ? `

    <!-- BOUTON PRINCIPAL : VALIDATION / PAIEMENT -->
    <table cellpadding="0" cellspacing="0" align="center" style="margin-top:28px;">
      <tr>
        <td bgcolor="#f97316" style="padding:14px 26px;">
         <a
  href="https://mecaprint3d.fr/commande/${existingQuote._id}?token=${existingQuote.publicAccessToken}"
  style="
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
    font-size:15px;
    display:inline-block;
  "
>
  Valider et régler mon devis
</a>
        </td>
      </tr>
    </table>


    <!-- BOUTON PDF -->
    <table cellpadding="0" cellspacing="0" align="center" style="margin-top:16px;">
      <tr>
        <td bgcolor="#27272a" style="padding:14px 24px;">
          <a
            href="${publicPdfUrl}"
            style="
              color:#ffffff;
              text-decoration:none;
              font-weight:bold;
              font-size:15px;
              display:inline-block;
            "
          >
            Consulter le devis PDF
          </a>
        </td>
      </tr>
    </table>


    <!-- INFORMATION SÉCURITÉ -->
    <p style="
      margin:20px 0 0 0;
      color:#6b7280;
      font-size:12px;
      line-height:1.6;
      text-align:center;
    ">
      Ce lien sécurisé est personnel et reste valable pendant 30 jours.
    </p>


    <!-- LIENS DE SECOURS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;">
      <tr>
        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;">

          <p style="margin:0 0 12px 0;color:#374151;font-size:12px;line-height:1.6;">
            Certains pare-feu professionnels ou logiciels de messagerie peuvent bloquer l'ouverture directe des boutons.
          </p>

          <p style="margin:0 0 12px 0;color:#6b7280;font-size:12px;">
            En cas de besoin, copiez les liens ci-dessous dans votre navigateur :
          </p>

          <p style="margin:0 0 10px 0;font-size:12px;">
            <strong>Validation et paiement :</strong><br>
            <a 
  href="https://mecaprint3d.fr/commande/${existingQuote._id}?token=${existingQuote.publicAccessToken}"
  style="color:#f97316;text-decoration:underline;"
>
  https://mecaprint3d.fr/commande/${existingQuote._id}?token=${existingQuote.publicAccessToken}
</a>
          </p>

          <p style="margin:0;font-size:12px;">
            <strong>Consultation du devis :</strong><br>
            <a href="${publicPdfUrl}"
               style="color:#f97316;">
              ${publicPdfUrl}
            </a>
          </p>

        </td>
      </tr>
    </table>

  `
  : ""
}
            <p style="margin:30px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
              Merci pour votre confiance,<br/>
              L’équipe MecaPrint3D
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:18px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;">
            MecaPrint3D — Fabrication additive • Pièces techniques • Covering • Sur-mesure
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

        `,
      });

    }

   // =====================================================
   // 🔄 RECHARGEMENT DU DEVIS APRÈS SAUVEGARDE
   // Permet de retourner la dernière version de MongoDB
   // avec tous les champs mis à jour :
   // - quoteSentAt
   // - token d'accès public
   // - date d'expiration
   // - updatedAt
   // =====================================================
  const updatedQuote = await Quote.findById(
  req.params.id
  ).lean();


// =====================================================
// 📤 RESPONSE API
// =====================================================
  res.json({
  success: true,
  quote: updatedQuote,
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
    const quoteNumber = await generateQuoteNumber();

    const quote = await Quote.create({
      ...req.body,
      files: uploadedFiles,
      quoteNumber,
    });

    console.log("✅ SAUVEGARDE MONGO OK");
    console.log("📄 ID :", quote._id);
    console.log("📄 BASE :", quote.constructor.db.name);
    console.log("📄 COLLECTION :", quote.constructor.collection.name);
    console.log("📩 Nouveau devis :", quote._id);
    console.log("🔢 Numéro devis :", quote.quoteNumber);

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
// POST /api/quotes/:id/checkout?token=...
// =====================================================
router.post("/:id/checkout", async (req, res) => {
  try {
    // =====================================================
    // FIND QUOTE
    // =====================================================
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });
    }

    // =====================================================
    // 🔐 TOKEN PUBLIC OBLIGATOIRE
    // Le paiement est autorisé uniquement avec le lien sécurisé
    // envoyé par email au client.
    // =====================================================
    const token = req.query.token;

    if (
      !token ||
      !quote.publicAccessToken ||
      token !== quote.publicAccessToken
    ) {
      return res.status(403).json({
        success: false,
        error: "Lien de paiement invalide.",
      });
    }

    // =====================================================
    // ⏳ EXPIRATION DU LIEN
    // Même logique que le PDF public.
    // =====================================================
    if (
      quote.publicAccessTokenExpiresAt &&
      new Date(quote.publicAccessTokenExpiresAt) < new Date()
    ) {
      return res.status(403).json({
        success: false,
        error: "Lien de paiement expiré.",
      });
    }

    // =====================================================
    // CHECK LINES
    // =====================================================
    const lines = quote.quoteLines || [];

    if (!lines.length) {
      return res.status(400).json({
        success: false,
        error: "Aucune ligne de devis",
      });
    }

    // =====================================================
    // CREATE STRIPE SESSION
    // =====================================================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      customer_email: quote.email,

      line_items: lines.map((line) => ({
        price_data: {
          currency: "eur",

          product_data: {
            name:
              line.label ||
              `Devis ${quote.quoteNumber || "MecaPrint3D"}`,
          },

          unit_amount: Math.round(
            Number(line.unitPrice || 0) * 100
          ),
        },

        quantity: Number(line.quantity || 1),
      })),

      success_url:
        "https://mecaprint3d.fr/success",

      cancel_url:
        `https://mecaprint3d.fr/commande/${quote._id}?token=${quote.publicAccessToken}`,

      metadata: {
        quoteId: String(quote._id),
        quoteNumber: quote.quoteNumber || "",
      },
    });

    // =====================================================
    // SAVE STRIPE SESSION
    // =====================================================
    quote.stripeSessionId = session.id;
    quote.paymentStatus = "En attente";

    await quote.save();

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.error("❌ Erreur checkout devis :", error);

    res.status(500).json({
      success: false,
      error: "Erreur Stripe",
    });
  }
});

// =====================================================
// 📄 PDF PUBLIC SÉCURISÉ
// GET /api/quotes/:id/public-pdf?token=...
// =====================================================
router.get("/:id/public-pdf", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });
    }

    const token = req.query.token;

    if (
      !token ||
      !quote.publicAccessToken ||
      token !== quote.publicAccessToken
    ) {
      return res.status(403).json({
        success: false,
        error: "Accès refusé",
      });
    }

    if (
      quote.publicAccessTokenExpiresAt &&
      new Date(quote.publicAccessTokenExpiresAt) < new Date()
    ) {
      return res.status(403).json({
        success: false,
        error: "Lien expiré",
      });
    }

    generateQuotePdf(res, quote);
  } catch (error) {
    console.error("❌ Erreur PDF public :", error);

    res.status(500).json({
      success: false,
      error: "Erreur génération PDF",
    });
  }
});
module.exports = router;