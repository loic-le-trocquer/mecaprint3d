console.log("✅ MATERIAL UPLOADS ROUTE CHARGÉE");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../services/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

function bufferToDataUri(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

// =============================
// IMAGE MATÉRIAU
// =============================
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      bufferToDataUri(req.file),
      {
        folder: "materials/images",
        resource_type: "image",
      }
    );

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =============================
// FICHE TECHNIQUE PDF
// =============================
router.post("/datasheet", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      bufferToDataUri(req.file),
      {
        folder: "materials/datasheets",
        resource_type: "auto",
       use_filename: true,
    unique_filename: true,
      }
    );

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/test", (req, res) => {
  res.json({
    success: true,
    route: "material uploads",
  });
});
module.exports = router;