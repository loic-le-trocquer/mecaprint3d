require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const quoteRoutes = require("./routes/quotes");
const siteContentRoutes = require("./routes/siteContent");

const app = express();

const PORT = process.env.PORT || 4242;

// ================= CORS =================

const corsOptions = {
  origin: [
    "https://mecaprint3d.fr",
    "https://www.mecaprint3d.fr",
    "https://mecaprint3d.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.json({
    message: "MecaPrint3D API OK",
  });
});

app.use("/api/quotes", quoteRoutes);
app.use("/api/site-content", siteContentRoutes);

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error("❌ Erreur globale :", err);

  res.status(500).json({
    success: false,
    error: err.message || "Erreur serveur",
  });
});

// ================= MONGODB =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB error :", error);
  });