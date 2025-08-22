// backend/routes/navbar.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/navbar
router.get("/", (req, res) => {
  db.query("SELECT * FROM navbar_config WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Error al obtener navbar:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Navbar no encontrado" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
