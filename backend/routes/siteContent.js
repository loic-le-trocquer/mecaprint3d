const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const SiteContent = require("../models/SiteContent");
const defaultSiteContent = require("../defaultSiteContent");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Seules les images sont autorisées."));
    }
    cb(null, true);
  },
});

async function getOrCreateContent() {
  let content = await SiteContent.findOne({ key: "main" }).lean();

  if (!content) {
    content = await SiteContent.create(defaultSiteContent);
    return content.toObject();
  }

  return content;
}

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const expectedToken = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      error: "ADMIN_PASSWORD ou ADMIN_TOKEN manquant dans les variables d’environnement.",
    });
  }

  if (token !== expectedToken) {
    return res.status(401).json({ success: false, error: "Accès admin refusé." });
  }

  next();
}

function uploadImageToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mecaprint3d/site",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

router.get("/", async (req, res, next) => {
  try {
    const content = await getOrCreateContent();
    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  const expectedToken = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      error: "ADMIN_PASSWORD ou ADMIN_TOKEN manquant dans les variables d’environnement.",
    });
  }

  if (password !== process.env.ADMIN_PASSWORD && password !== expectedToken) {
    return res.status(401).json({ success: false, error: "Mot de passe incorrect." });
  }

  res.json({ success: true, token: expectedToken });
});

router.put("/admin", adminAuth, async (req, res, next) => {
  try {
    const payload = { ...req.body, key: "main" };
    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    const content = await SiteContent.findOneAndUpdate(
      { key: "main" },
      payload,
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/upload", adminAuth, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Aucune image reçue." });
    }

    const result = await uploadImageToCloudinary(req.file);

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
