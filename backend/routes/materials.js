const express = require("express");
const router = express.Router();
const Material = require("../models/Material");
console.log("✅ ROUTE MATERIALS CHARGÉE");
// =============================
// GET ALL MATERIALS
// =============================
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().sort({
      brand: 1,
      family: 1,
      name: 1,
    });

    res.json(materials);
  } catch (error) {
  console.error("🔥 MATERIAL ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
});

// =============================
// CREATE MATERIAL
// =============================
router.post("/", async (req, res) => {
  try {
    const payload = { ...req.body };

if (!payload.slug && payload.name) {
  payload.slug = payload.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const material = await Material.create(payload);

    res.status(201).json(material);
  } catch (error) {
  console.error("🔥 MATERIAL ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
});

// =============================
// UPDATE MATERIAL
// =============================
router.put("/:id", async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(material);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =============================
// DELETE MATERIAL
// =============================
router.delete("/:id", async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =============================
// DUPLICATE MATERIAL
// =============================
router.post("/:id/duplicate", async (req, res) => {
  try {
    const original = await Material.findById(req.params.id);

    if (!original) {
      return res.status(404).json({
        message: "Matériau introuvable",
      });
    }

    const copy = original.toObject();

    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;

    copy.name = `${copy.name} - copie`;
    copy.slug = `${copy.slug}-copie-${Date.now()}`;
    copy.source = "duplicate";

    const duplicated = await Material.create(copy);

    res.status(201).json(duplicated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =============================
// IMPORT MATERIALS
// =============================
router.post("/import", async (req, res) => {
  try {
    const materials = req.body.materials || [];

    const results = [];

    for (const item of materials) {
      const existing = await Material.findOne({
        slug: item.slug,
      });

      if (existing) {
        Object.assign(existing, {
          ...item,
          source: "import",
        });

        await existing.save();

        results.push({
          name: item.name,
          action: "updated",
        });
      } else {
        await Material.create({
          ...item,
          source: "import",
        });

        results.push({
          name: item.name,
          action: "created",
        });
      }
    }

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;