const express = require("express");
const router = express.Router();

const Material = require("../models/Material");

// =====================================================
// 📋 LISTE DES MATÉRIAUX
// GET /api/materials
// =====================================================
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find({
      active: true,
    }).sort({
      sortOrder: 1,
      name: 1,
    });

    res.json({
      success: true,
      materials,
    });
  } catch (error) {
    console.error(
      "❌ Erreur récupération matériaux :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

// =====================================================
// ➕ AJOUT MATÉRIAU
// POST /api/materials
// =====================================================
router.post("/", async (req, res) => {
  try {
    const material =
      await Material.create(req.body);

    res.json({
      success: true,
      material,
    });
  } catch (error) {
    console.error(
      "❌ Erreur création matériau :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

// =====================================================
// ✏️ MODIFICATION
// PUT /api/materials/:id
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const material =
      await Material.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json({
      success: true,
      material,
    });
  } catch (error) {
    console.error(
      "❌ Erreur modification matériau :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

// =====================================================
// 🗑️ SUPPRESSION
// DELETE /api/materials/:id
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    await Material.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "❌ Erreur suppression matériau :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

module.exports = router;