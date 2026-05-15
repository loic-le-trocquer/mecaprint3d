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

router.post("/", upload.single("file",10), async (req, res) => {
  try {
    let uploadedFile = [];

    if (req.files?.length) {
  uploadedFiles = await Promise.all(
    req.files.map(async (file) => {
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
    const quote = await Quote.create({
      ...req.body,
      files: uploadedFiles,
    });

    console.log("📩 Nouveau devis :", quote._id);

    await sendEmail({
      to: quote.email,
      subject: "Votre demande de devis MecaPrint3D",
      html: `
        <h1>MecaPrint3D</h1>
        <p>Bonjour ${quote.name},</p>
        <p>Nous avons bien reçu votre demande de devis.</p>
        <p><strong>Projet :</strong> ${quote.project}</p>
        <p><strong>Message :</strong><br/>${quote.message}</p>
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