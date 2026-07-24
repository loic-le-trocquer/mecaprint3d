const express = require("express");
const {
  authorizationUrl,
  validateState,
  exchangeAuthorizationCode,
  connectionStatus,
} = require("../services/qonto");

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: "Accès non autorisé" });
  }
  next();
}

router.get("/status", requireAdmin, async (req, res) => {
  try {
    res.json({ success: true, ...(await connectionStatus()) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/authorization-url", requireAdmin, (req, res) => {
  try {
    res.json({ success: true, url: authorizationUrl() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/callback", async (req, res) => {
  try {
    if (req.query.error) {
      throw new Error(req.query.error_description || req.query.error);
    }
    if (!req.query.code || !validateState(req.query.state)) {
      return res.status(400).send("Connexion Qonto invalide ou expirée.");
    }
    await exchangeAuthorizationCode(req.query.code);
    res
      .status(200)
      .send(
        "<!doctype html><html lang='fr'><meta charset='utf-8'><title>Qonto connecté</title><body style='font-family:Arial;background:#09090b;color:white;padding:48px'><h1 style='color:#f97316'>Qonto est connecté ✅</h1><p>Les prochaines demandes de devis seront synchronisées automatiquement.</p><p>Vous pouvez fermer cette page.</p></body></html>"
      );
  } catch (error) {
    console.error("Erreur callback Qonto :", error);
    res
      .status(500)
      .send(`Connexion Qonto impossible : ${String(error.message || error)}`);
  }
});

module.exports = router;
