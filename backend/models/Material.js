const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "Polymaker",
    },

    family: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    colors: {
      type: [String],
      default: [],
    },

    applications: {
      type: [String],
      default: [],
    },

    properties: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    resistance: {
      mechanical: { type: Number, default: 3 },
      temperature: { type: Number, default: 2 },
      uv: { type: Number, default: 2 },
      flexibility: { type: Number, default: 1 },
      finish: { type: Number, default: 4 },
    },

    productSheet: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

// ===============================
// COMMERCE / STOCK
// ===============================
    price: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    leadTime: {
      type: String,
      default: "",
    },

    datasheetUrl: {
      type: String,
      default: "",
    },

    manufacturerUrl: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);