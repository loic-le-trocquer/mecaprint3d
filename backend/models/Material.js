const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    // =============================
    // IDENTITÉ
    // =============================
    brand: {
      type: String,
      default: "Polymaker",
      trim: true,
    },

    family: {
      type: String,
      trim: true,
    },

    range: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    // =============================
    // COMMERCIAL
    // =============================
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
      default: "Sur commande",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // =============================
    // APPLICATIONS
    // =============================
    applications: {
      type: [String],
      default: [],
    },

    sectors: {
      type: [String],
      default: [],
    },

    partExamples: {
      type: [String],
      default: [],
    },

    // =============================
    // POINTS FORTS
    // =============================
    strengths: {
      type: [String],
      default: [],
    },

    // =============================
    // PERFORMANCES VISUELLES 1 À 5
    // =============================
    performance: {
      strength: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },

      heatResistance: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },

      chemicalResistance: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },

      flexibility: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },

      easeOfPrint: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },

      surfaceQuality: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
      },
    },

    // =============================
    // DONNÉES TECHNIQUES IMPRESSION
    // =============================
    printSettings: {
      nozzleTemp: {
        type: String,
        default: "",
      },

      bedTemp: {
        type: String,
        default: "",
      },

      chamberTemp: {
        type: String,
        default: "",
      },

      printSpeed: {
        type: String,
        default: "",
      },

      fan: {
        type: String,
        default: "",
      },

      drying: {
        type: String,
        default: "",
      },

      enclosureRecommended: {
        type: Boolean,
        default: false,
      },

      abrasive: {
        type: Boolean,
        default: false,
      },

      hygroscopic: {
        type: Boolean,
        default: false,
      },
    },

    // =============================
    // PROPRIÉTÉS PHYSIQUES
    // =============================
    physical: {
      density: {
        type: String,
        default: "",
      },

      shrinkage: {
        type: String,
        default: "",
      },
    },

    // =============================
    // MÉCANIQUE
    // =============================
    mechanical: {
      tensileStrength: {
        type: String,
        default: "",
      },

      youngModulus: {
        type: String,
        default: "",
      },

      bendingStrength: {
        type: String,
        default: "",
      },

      impactStrength: {
        type: String,
        default: "",
      },

      elongationAtBreak: {
        type: String,
        default: "",
      },
    },

    // =============================
    // THERMIQUE
    // =============================
    thermal: {
      hdt: {
        type: String,
        default: "",
      },

      glassTransition: {
        type: String,
        default: "",
      },

      meltingTemp: {
        type: String,
        default: "",
      },
    },

    // =============================
    // CHIMIQUE / USAGE
    // =============================
    usage: {
      foodContact: {
        type: Boolean,
        default: false,
      },

      outdoorUse: {
        type: Boolean,
        default: false,
      },

      uvResistance: {
        type: Boolean,
        default: false,
      },

      chemicalResistanceNote: {
        type: String,
        default: "",
      },
    },

    // =============================
    // VISUELS
    // =============================
    imageUrl: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },

    marketingImages: {
      type: [String],
      default: [],
    },

    renderImages: {
      type: [String],
      default: [],
    },

    // =============================
    // DOCUMENTS
    // =============================
    datasheetUrl: {
      type: String,
      default: "",
    },

    printingGuideUrl: {
      type: String,
      default: "",
    },

    safetyDataUrl: {
      type: String,
      default: "",
    },

    // =============================
    // CLOUDINARY
    // =============================
    cloudinary: {
      imageFolder: {
        type: String,
        default: "/materials/images",
      },

      datasheetFolder: {
        type: String,
        default: "/materials/datasheets",
      },

      marketingFolder: {
        type: String,
        default: "/materials/marketing",
      },

      renderFolder: {
        type: String,
        default: "/materials/renders",
      },
    },

    // =============================
    // ADMIN
    // =============================
    source: {
      type: String,
      default: "manual",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);