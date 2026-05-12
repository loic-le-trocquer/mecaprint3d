const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    number: String,
    title: String,
    description: String,
    badge: { type: String, default: "Sur devis" },
  },
  { _id: false }
);

const RealisationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
    category: String,
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    brand: {
      name: { type: String, default: "MecaPrint3D" },
      logoUrl: { type: String, default: "" },
      email: { type: String, default: "contact@mecaprint3d.fr" },
      location: { type: String, default: "France" },
    },
    hero: {
      badge: String,
      title: String,
      highlight: String,
      description: String,
      primaryButton: String,
      secondaryButton: String,
      imageUrl: String,
    },
    steps: [String],
    servicesIntro: {
      eyebrow: String,
      title: String,
      description: String,
    },
    services: [ServiceSchema],
    realisationsIntro: {
      eyebrow: String,
      title: String,
      description: String,
    },
    realisations: [RealisationSchema],
    quoteIntro: {
      eyebrow: String,
      title: String,
      description: String,
      bullets: [String],
    },
    footer: {
      description: String,
      legal: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", SiteContentSchema);
