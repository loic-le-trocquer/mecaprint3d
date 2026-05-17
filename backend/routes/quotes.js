const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const Quote = require("../models/Quote");
const sendEmail = require("../services/sendEmail");

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

    if (receivedFiles.length) {
  uploadedFiles = await Promise.all(
    receivedFiles.map(async (file) => {
      const cloudinaryResult = await uploadToCloudinary(file);

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
    const quote = await Quote.create({
      ...req.body,
      files: uploadedFiles,
    });

    console.log("📩 Nouveau devis :", quote._id);

    console.log("📧 EMAIL CLIENT =", quote.email);
    
   await sendEmail({
  to: quote.email,
  subject: "Votre demande de devis MecaPrint3D",
  html: `
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="620" cellpadding="0" cellspacing="0"
            style="background:#18181b;border-radius:24px;overflow:hidden;border:1px solid #27272a;">

            <!-- HEADER -->
            <tr>
              <td style="padding:40px;background:linear-gradient(135deg,#f97316,#ea580c);">

                <h1 style="margin:0;color:white;font-size:34px;font-weight:900;">
                  MECAPRINT3D
                </h1>

                <p style="margin-top:12px;color:white;font-size:16px;line-height:1.6;">
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

                <p style="font-size:16px;line-height:1.7;color:#d4d4d8;">
                  Merci pour votre demande de devis.
                  Votre projet est maintenant en cours d’analyse par notre atelier.
                </p>

                <!-- RECAP -->
                <div style="margin-top:30px;padding:24px;border-radius:18px;background:#09090b;border:1px solid #27272a;">

                  <h2 style="margin-top:0;color:#f97316;font-size:20px;">
                    Récapitulatif du projet
                  </h2>

                  <p><strong>Projet :</strong> ${quote.project}</p>

                  <p><strong>Quantité :</strong>
                    ${quote.quantity || "Non précisée"}
                  </p>

                  <p><strong>Matière :</strong>
                    ${quote.material || "À définir"}
                  </p>

                  <p>
                    <strong>Message :</strong><br/>
                    ${quote.message || "Aucun message"}
                  </p>

                </div>

                <!-- FILES -->
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
                                    style="color:#fb923c;text-decoration:none;"
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
                <div style="margin-top:35px;padding:22px;border-radius:18px;background:#27272a;">

                  <p style="margin:0;font-size:15px;line-height:1.7;color:#fafafa;">
                    Nous revenons vers vous rapidement avec :
                  </p>

                  <ul style="margin-top:14px;color:#d4d4d8;line-height:1.8;">
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
                    style="display:inline-block;background:#f97316;color:white;
                    text-decoration:none;padding:16px 28px;border-radius:14px;
                    font-weight:800;font-size:15px;"
                  >
                    Accéder au site MECAPRINT3D
                  </a>

                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:28px;background:#09090b;border-top:1px solid #27272a;">

                <p style="margin:0;color:#71717a;font-size:13px;text-align:center;line-height:1.7;">
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