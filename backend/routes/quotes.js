const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const Quote = require("../models/Quote");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require("pdfkit");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mecaprint3d/devis",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
// =====================================================
// 🔐 MIDDLEWARE ADMIN SIMPLE
// =====================================================
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      error: "Accès non autorisé",
    });
  }

  next();
}
// =====================================================
// 📋 LISTE DES DEVIS ADMIN
// GET /api/quotes
// =====================================================
router.get("/", requireAdmin, async (req, res) => {

  try {

    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .lean();

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
// ✏️ MISE À JOUR D’UN DEVIS
// PUT /api/quotes/:id
// =====================================================
router.put("/:id", requireAdmin, async (req, res) => {

  try {

    const quote = await Quote.findByIdAndUpdate(

      req.params.id,
{
  status: req.body.status,
  adminNotes: req.body.adminNotes,
  archived: req.body.archived,

  quoteAmount: req.body.quoteAmount,
  quoteDelay: req.body.quoteDelay,
  quoteComment: req.body.quoteComment,
},

      {
        new: true,
      }

    );

    res.json({
      success: true,
      quote,
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
// 📄 GENERATION PDF DEVIS
// GET /api/quotes/:id/pdf
// =====================================================
router.get("/:id/pdf", requireAdmin, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    const quoteNumber = `DEV-${new Date().getFullYear()}-${String(
      quote._id
    ).slice(-6).toUpperCase()}`;

    const quoteDate = new Date().toLocaleDateString("fr-FR");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${quoteNumber}.pdf`
    );

    doc.pipe(res);

    // =====================================================
    // COULEURS / HELPERS
    // =====================================================
    const orange = "#f97316";
    const dark = "#18181b";
    const black = "#09090b";
    const grey = "#71717a";
    const lightGrey = "#f4f4f5";

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 42;

    const sectionTitle = (title, y) => {
      doc
        .fontSize(13)
        .fillColor(orange)
        .text(title.toUpperCase(), margin, y, {
          characterSpacing: 0.8,
        });

      doc
        .moveTo(margin, y + 20)
        .lineTo(pageWidth - margin, y + 20)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();
    };

    const box = (x, y, w, h, color = "#ffffff") => {
      doc
        .roundedRect(x, y, w, h, 12)
        .fillColor(color)
        .fill();
    };

    // =====================================================
    // FOND
    // =====================================================
    doc.rect(0, 0, pageWidth, pageHeight).fillColor(lightGrey).fill();

    // =====================================================
    // HEADER
    // =====================================================
    doc.rect(0, 0, pageWidth, 145).fillColor(dark).fill();

    doc
      .rect(0, 0, 12, 145)
      .fillColor(orange)
      .fill();

    doc
      .fontSize(28)
      .fillColor("#ffffff")
      .text("MECAPRINT3D", margin, 34);

    doc
      .fontSize(10)
      .fillColor("#d4d4d8")
      .text(
        "Fabrication additive • Prototypage • Réparation • Conception",
        margin,
        70
      );

    doc
      .fontSize(24)
      .fillColor(orange)
      .text("DEVIS", pageWidth - 190, 34, {
        width: 145,
        align: "right",
      });

    doc
      .fontSize(10)
      .fillColor("#d4d4d8")
      .text(quoteNumber, pageWidth - 190, 68, {
        width: 145,
        align: "right",
      });

    doc
      .fontSize(10)
      .fillColor("#d4d4d8")
      .text(`Date : ${quoteDate}`, pageWidth - 190, 86, {
        width: 145,
        align: "right",
      });

    // =====================================================
    // BLOC ENTREPRISE / CLIENT
    // =====================================================
    box(margin, 175, 245, 118, "#ffffff");
    box(pageWidth - margin - 245, 175, 245, 118, "#ffffff");

    doc
      .fontSize(11)
      .fillColor(orange)
      .text("ÉMETTEUR", margin + 18, 193);

    doc
      .fontSize(10)
      .fillColor("#111827")
      .text("MECAPRINT3D", margin + 18, 216)
      .text("Entrepreneur individuel", margin + 18, 232)
      .text("SIRET : 52539319500041", margin + 18, 248)
      .text("APE : 7410Z", margin + 18, 264)
      .text("mecaprint3d.fr", margin + 18, 280);

    doc
      .fontSize(11)
      .fillColor(orange)
      .text("CLIENT", pageWidth - margin - 227, 193);

    doc
      .fontSize(10)
      .fillColor("#111827")
      .text(quote.name || "-", pageWidth - margin - 227, 216)
      .text(quote.email || "-", pageWidth - margin - 227, 232)
      .text(quote.phone || "-", pageWidth - margin - 227, 248);

    // =====================================================
    // PROJET
    // =====================================================
    sectionTitle("Projet", 325);

    box(margin, 360, pageWidth - margin * 2, 105, "#ffffff");

    doc
      .fontSize(10)
      .fillColor(grey)
      .text("Projet", margin + 18, 382);

    doc
      .fontSize(12)
      .fillColor("#111827")
      .text(quote.project || "-", margin + 18, 400);

    doc
      .fontSize(10)
      .fillColor(grey)
      .text("Quantité", margin + 260, 382);

    doc
      .fontSize(12)
      .fillColor("#111827")
      .text(String(quote.quantity || "-"), margin + 260, 400);

    doc
      .fontSize(10)
      .fillColor(grey)
      .text("Matière", margin + 390, 382);

    doc
      .fontSize(12)
      .fillColor("#111827")
      .text(quote.material || "À définir", margin + 390, 400);

    if (quote.message) {
      doc
        .fontSize(10)
        .fillColor(grey)
        .text("Message client", margin + 18, 430);

      doc
        .fontSize(10)
        .fillColor("#111827")
        .text(quote.message, margin + 115, 430, {
          width: pageWidth - margin * 2 - 135,
        });
    }

    // =====================================================
    // PROPOSITION COMMERCIALE
    // =====================================================
    sectionTitle("Proposition commerciale", 500);

    box(margin, 535, pageWidth - margin * 2, 125, "#ffffff");

    doc
      .fontSize(11)
      .fillColor(grey)
      .text("Montant proposé", margin + 18, 555);

    doc
      .fontSize(28)
      .fillColor(orange)
      .text(`${quote.quoteAmount || 0} €`, margin + 18, 576);

    doc
      .fontSize(11)
      .fillColor(grey)
      .text("Délai estimé", margin + 230, 555);

    doc
      .fontSize(16)
      .fillColor("#111827")
      .text(quote.quoteDelay || "-", margin + 230, 580);

    if (quote.quoteComment) {
      doc
        .fontSize(10)
        .fillColor(grey)
        .text("Commentaire", margin + 18, 620);

      doc
        .fontSize(10)
        .fillColor("#111827")
        .text(quote.quoteComment, margin + 115, 620, {
          width: pageWidth - margin * 2 - 135,
        });
    }

    // =====================================================
    // FICHIERS
    // =====================================================
    sectionTitle("Fichiers transmis", 695);

    doc.fontSize(10).fillColor("#111827");

    if (quote.files?.length) {
      quote.files.slice(0, 5).forEach((file, index) => {
        doc.text(
          `• ${file.originalName}`,
          margin,
          730 + index * 14
        );
      });
    } else {
      doc.text("Aucun fichier transmis.", margin, 730);
    }

    // =====================================================
    // FOOTER
    // =====================================================
    doc
      .rect(0, pageHeight - 70, pageWidth, 70)
      .fillColor(black)
      .fill();

    doc
      .fontSize(8)
      .fillColor("#d4d4d8")
      .text(
        "Ce devis est établi sous réserve de validation technique définitive après analyse complète des fichiers transmis.",
        margin,
        pageHeight - 52,
        { width: pageWidth - margin * 2 }
      );

    doc
      .fontSize(8)
      .fillColor("#a1a1aa")
      .text(
        "MECAPRINT3D — SIRET 52539319500041 — APE 7410Z — mecaprint3d.fr",
        margin,
        pageHeight - 28,
        {
          width: pageWidth - margin * 2,
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.error("❌ Erreur génération PDF :", error);

    res.status(500).json({
      success: false,
      error: "Erreur génération PDF",
    });
  }
});
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
      // 📦 UPLOAD DES FICHIERS SUR CLOUDINARY
      // =====================================================
      if (receivedFiles.length) {

        uploadedFiles = await Promise.all(

          receivedFiles.map(async (file) => {

            const cloudinaryResult =
              await uploadToCloudinary(file);

            return {
              originalName: file.originalname,
              filename: cloudinaryResult.public_id,
              path: cloudinaryResult.secure_url,
              mimetype: file.mimetype,
              size: file.size,
            };

          })

        );

      }

      // =====================================================
      // 💾 ENREGISTREMENT DU DEVIS EN BASE
      // =====================================================
// =====================================================
// 💾 ENREGISTREMENT DU DEVIS EN BASE
// =====================================================
const quote = await Quote.create({
  ...req.body,
  files: uploadedFiles,
});

console.log("📩 Nouveau devis :", quote._id);
console.log("📧 EMAIL CLIENT =", quote.email);

// =====================================================
// 📧 EMAIL CLIENT
// =====================================================
await sendEmail({

  to: quote.email,

  subject: "Votre demande de devis MecaPrint3D",

  html: `
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table
            width="620"
            cellpadding="0"
            cellspacing="0"
            style="
              background:#18181b;
              border-radius:24px;
              overflow:hidden;
              border:1px solid #27272a;
            "
          >

            <!-- HEADER -->
            <tr>
              <td
                style="
                  padding:40px;
                  background:linear-gradient(135deg,#f97316,#ea580c);
                "
              >

                <img
                  src="https://mecaprint3d.fr/logo-mail.jpg"
                  alt="MecaPrint3D"
                  width="320"
                  style="
                    display:block;
                    border:0;
                    outline:none;
                    text-decoration:none;
                  "
                />

                <p
                  style="
                    margin:24px 0 0 0;
                    color:white;
                    font-size:16px;
                    line-height:1.6;
                  "
                >
                  Votre demande de devis a bien été reçue.
                </p>

              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="padding:40px;color:#e4e4e7;">

                <p style="font-size:16px;line-height:1.7;">
                  Bonjour <strong>${quote.name}</strong>,
                </p>

                <p
                  style="
                    font-size:16px;
                    line-height:1.7;
                    color:#d4d4d8;
                  "
                >
                  Merci pour votre demande de devis.
                  Votre projet est maintenant en cours
                  d’analyse par notre atelier.
                </p>

                <!-- RECAP -->
                <div
                  style="
                    margin-top:30px;
                    padding:24px;
                    border-radius:18px;
                    background:#09090b;
                    border:1px solid #27272a;
                  "
                >

                  <h2
                    style="
                      margin-top:0;
                      color:#f97316;
                      font-size:20px;
                    "
                  >
                    Récapitulatif du projet
                  </h2>

                  <p>
                    <strong>Projet :</strong>
                    ${quote.project}
                  </p>

                  <p>
                    <strong>Quantité :</strong>
                    ${quote.quantity || "Non précisée"}
                  </p>

                  <p>
                    <strong>Matière :</strong>
                    ${quote.material || "À définir"}
                  </p>

                  <p>
                    <strong>Message :</strong><br/>
                    ${quote.message || "Aucun message"}
                  </p>

                </div>

                <!-- FICHIERS -->
                <div style="margin-top:30px;">

                  <h2 style="color:#f97316;font-size:20px;">
                    Fichiers transmis
                  </h2>

                  ${
                    quote.files?.length
                      ? `
                        <ul style="padding-left:20px;color:#d4d4d8;">

                          ${quote.files
                            .map(
                              (file) => `
                                <li style="margin-bottom:10px;">

                                  <a
                                    href="${file.path}"
                                    style="
                                      color:#fb923c;
                                      text-decoration:none;
                                    "
                                  >
                                    ${file.originalName}
                                  </a>

                                </li>
                              `
                            )
                            .join("")}

                        </ul>
                      `
                      : `
                        <p style="color:#a1a1aa;">
                          Aucun fichier joint.
                        </p>
                      `
                  }

                </div>

                <!-- INFO -->
                <div
                  style="
                    margin-top:35px;
                    padding:22px;
                    border-radius:18px;
                    background:#27272a;
                  "
                >

                  <p
                    style="
                      margin:0;
                      font-size:15px;
                      line-height:1.7;
                      color:#fafafa;
                    "
                  >
                    Nous revenons vers vous rapidement avec :
                  </p>

                  <ul
                    style="
                      margin-top:14px;
                      color:#d4d4d8;
                      line-height:1.8;
                    "
                  >
                    <li>Analyse technique</li>
                    <li>Choix matériau / technologie</li>
                    <li>Délai estimé</li>
                    <li>Tarification</li>
                  </ul>

                </div>

                <!-- CTA -->
                <div style="margin-top:40px;text-align:center;">

                  <a
                    href="https://mecaprint3d.fr"
                    style="
                      display:inline-block;
                      background:#f97316;
                      color:white;
                      text-decoration:none;
                      padding:16px 28px;
                      border-radius:14px;
                      font-weight:800;
                      font-size:15px;
                    "
                  >
                    Accéder au site MECAPRINT3D
                  </a>

                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding:28px;
                  background:#09090b;
                  border-top:1px solid #27272a;
                "
              >

                <p
                  style="
                    margin:0;
                    color:#71717a;
                    font-size:13px;
                    text-align:center;
                    line-height:1.7;
                  "
                >
                  MECAPRINT3D — Impression 3D • Prototypage • Réparation • Conception
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `,
});

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle demande - ${quote.project}`,
      html: `
        <h1>Nouvelle demande de devis</h1>
        <p><strong>Nom :</strong> ${quote.name}</p>
        <p><strong>Email :</strong> ${quote.email}</p>
        <p><strong>Téléphone :</strong> ${quote.phone || "Non renseigné"}</p>
        <p><strong>Projet :</strong> ${quote.project}</p>
        <p><strong>Quantité :</strong> ${quote.quantity || "Non précisée"}</p>
        <p><strong>Matière :</strong> ${quote.material || "À définir"}</p>
        <p><strong>Message :</strong><br/>${quote.message}</p>
        <p><strong>Fichiers :</strong></p>

<ul>
  ${
    quote.files?.length
      ? quote.files
          .map(
            (file) =>
              `<li><a href="${file.path}">${file.originalName}</a></li>`
          )
          .join("")
      : "<li>Aucun fichier</li>"
  }
</ul>
      `,
    });

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("❌ Erreur devis :", error);

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

module.exports = router;