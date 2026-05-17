const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // =====================================================
    // 👤 CLIENT
    // =====================================================
    name: String,
    email: String,
    phone: String,

    // =====================================================
    // 📦 PROJET
    // =====================================================
    project: String,
    quantity: Number,
    material: String,
    message: String,

    // =====================================================
    // 📎 FICHIERS
    // =====================================================
    files: [
      {
        originalName: String,
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],

    // =====================================================
    // 📌 SUIVI ADMIN
    // =====================================================
    status: {
      type: String,
      enum: [
        "Nouveau",
        "En analyse",
        "Devis envoyé",
        "En fabrication",
        "Terminé",
        "Refusé",
      ],
      default: "Nouveau",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);