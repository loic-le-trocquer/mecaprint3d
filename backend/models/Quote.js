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
     // ===============================
    // DEVIS COMMERCIAL
    // ===============================
    quoteAmount: {
      type: Number,
      default: 0,
    },

    quoteDelay: {
      type: String,
      default: "",
    },

    quoteComment: {
      type: String,
      default: "",
    },

// ===============================
// ACCÈS PUBLIC SÉCURISÉ AU DEVIS
// ===============================
publicAccessToken: {
  type: String,
  default: "",
},

publicAccessTokenExpiresAt: {
  type: Date,
  default: null,
},

// ===============================
// PAIEMENT / COMMANDE
// ===============================
paymentStatus: {
  type: String,
  enum: [
    "En attente",
    "Payé",
    "Annulé",
  ],
  default: "En attente",
},

stripeSessionId: {
  type: String,
  default: "",
},

quoteNumber: {
  type: String,
  default: "",
},


quoteLines: [
  {
    label: String,
    quantity: {
      type: Number,
      default: 1,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
],

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);