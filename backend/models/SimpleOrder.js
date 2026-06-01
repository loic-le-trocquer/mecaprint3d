const mongoose = require("mongoose");

// =====================================================
// COMMANDE RAPIDE
// =====================================================
const simpleOrderSchema = new mongoose.Schema(
  {
    // =====================================================
    // CLIENT
    // =====================================================
    name: String,
    email: String,
    phone: String,

    // =====================================================
    // FICHIER 3D
    // =====================================================
    file: {
      originalName: String,
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },

    // =====================================================
    // CONFIGURATION
    // =====================================================
    technology: {
      type: String,
      default: "FDM atelier",
    },

    material: {
      type: String,
      enum: ["PLA", "PETG", "TPU", "ASA"],
      default: "PLA",
    },

    size: {
      type: String,
      enum: ["S", "M", "L", "XL"],
      default: "S",
    },

    color: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    comment: {
      type: String,
      default: "",
    },

    // =====================================================
    // PRIX
    // =====================================================
    unitPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    // =====================================================
    // STRIPE
    // =====================================================
    stripeSessionId: String,
    stripePaymentIntentId: String,

    paymentStatus: {
      type: String,
      enum: ["En attente", "Payé", "Annulé"],
      default: "En attente",
    },

    // =====================================================
    // SUIVI ADMIN
    // =====================================================
    status: {
      type: String,
      enum: [
        "Nouvelle",
        "Payée",
        "En fabrication",
        "Terminée",
        "Annulée",
        "Requalifiée en devis",
      ],
      default: "Nouvelle",
    },

    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SimpleOrder",
  simpleOrderSchema
);