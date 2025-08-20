// backend/routes/testimonios.js
const express = require("express");
const router = express.Router();
const con = require("../config/db");

// 📌 Obtener todos los testimonios
router.get("/", (req, res) => {
  con.query("SELECT * FROM testimonios", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener testimonios:", err);
      return res.status(500).json({ error: "Error al obtener testimonios" });
    }
    res.json(results);
  });
});

// 📌 Agregar un testimonio
router.post("/", (req, res) => {
  const { titulo, url } = req.body;

  if (!titulo || !url) {
    return res.status(400).json({ error: "Título y URL son requeridos" });
  }

  con.query(
    "INSERT INTO testimonios (titulo, url) VALUES (?, ?)",
    [titulo, url],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar testimonio:", err);
        return res.status(500).json({ error: "Error al insertar testimonio" });
      }
      res.json({ message: "✅ Testimonio agregado", id: result.insertId });
    }
  );
});

// 📌 Eliminar un testimonio
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  con.query("DELETE FROM testimonios WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar testimonio:", err);
      return res.status(500).json({ error: "Error al eliminar testimonio" });
    }
    res.json({ message: "✅ Testimonio eliminado" });
  });
});

module.exports = router;
