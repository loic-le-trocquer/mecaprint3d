const express = require("express");
const multer = require("multer");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const SimpleOrder = require("../models/SimpleOrder");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// =====================================================
// UPLOAD STORAGE
// =====================================================
const storage = multer.diskStorage({
  destination: "uploads/simple-orders/",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// =====================================================
// UPLOAD CONFIG
// =====================================================
const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [".stl", ".obj", ".3mf", ".step", ".stp"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(new Error("Format fichier non autorisé"));
    }

    cb(null, true);
  },
});

// =====================================================
// ADMIN MIDDLEWARE
// =====================================================
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      error: "Accès non autorisé",
    });
  }

  next();
}

// =====================================================
// PRICE CALCULATION
// =====================================================
function calculatePrice({ size, material, quantity }) {
  const basePrices = {
    S: 9.9,
    M: 14.9,
    L: 24.9,
    XL: 39.9,
  };

  const materialMultiplier = {
    PLA: 1,
    PETG: 1.15,
    TPU: 1.35,
    ASA: 1.45,
  };

  const safeSize = basePrices[size] ? size : "S";
  const safeMaterial = materialMultiplier[material] ? material : "PLA";
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  const unitPrice =
    basePrices[safeSize] * materialMultiplier[safeMaterial];

  const totalPrice = unitPrice * safeQuantity;

  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
}

// =====================================================
// CREATE CHECKOUT SESSION
// POST /api/simple-orders/create-checkout
// =====================================================
router.post(
  "/create-checkout",
  upload.single("file"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        material,
        size,
        color,
        quantity,
        comment,
      } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email requis",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Fichier 3D requis",
        });
      }

      const safeQuantity = Math.max(1, Number(quantity) || 1);

      const { unitPrice, totalPrice } = calculatePrice({
        size,
        material,
        quantity: safeQuantity,
      });

      const order = await SimpleOrder.create({
        name: name || "",
        email,
        phone: phone || "",

        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },

        technology: "FDM atelier",
        material: material || "PLA",
        size: size || "S",
        color: color || "",
        quantity: safeQuantity,
        comment: comment || "",

        unitPrice,
        totalPrice,

        paymentStatus: "En attente",
        status: "Nouvelle",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "eur",

              product_data: {
                name: `Commande rapide impression 3D - ${order.size} / ${order.material}`,
                description: `Fichier : ${order.file.originalName}`,
              },

              unit_amount: Math.round(order.unitPrice * 100),
            },

            quantity: order.quantity,
          },
        ],

        customer_email: email,

        success_url:
          "https://mecaprint3d.fr/commande-rapide/success",

        cancel_url:
          "https://mecaprint3d.fr/commande-rapide/cancel",

        metadata: {
          simpleOrderId: String(order._id),
        },
      });

      order.stripeSessionId = session.id;
      await order.save();

      res.json({
        success: true,
        url: session.url,
        order,
      });
    } catch (error) {
      console.error("❌ Erreur commande rapide :", error);

      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }
);

// =====================================================
// ADMIN LIST
// GET /api/simple-orders
// =====================================================
router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await SimpleOrder.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Erreur liste commandes rapides :", error);

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
});

module.exports = router;