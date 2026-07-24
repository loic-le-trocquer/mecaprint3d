const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // =====================================================
    // 👤 CLIENT
    // =====================================================
    name: String,
    email: String,
    phone: String,
    address: String,
    zipCode: String,
    city: String,

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

    quoteSentAt: {
    type: Date,
    default: null,
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

qontoSyncStatus: {
  type: String,
  enum: ["En attente", "Synchronisé", "Erreur"],
  default: "En attente",
},

qontoClientId: {
  type: String,
  default: "",
},

qontoQuoteId: {
  type: String,
  default: "",
},

qontoQuoteUrl: {
  type: String,
  default: "",
},

qontoSyncError: {
  type: String,
  default: "",
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
