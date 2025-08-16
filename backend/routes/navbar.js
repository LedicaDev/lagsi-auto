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

// routes/navbar.js
/* router.get("/", async (req, res) => {
  const [row] = await db.query("SELECT * FROM navbar_config WHERE id=1");
  res.json(row);
});

router.put("/", async (req, res) => {
  const { logoUrl, items, bgColor } = req.body;
  await db.query(
    "UPDATE navbar_config SET logo_url=?, items=?, bg_color=? WHERE id=1",
    [logoUrl, JSON.stringify(items), bgColor]
  );
  res.sendStatus(204);
}); */
