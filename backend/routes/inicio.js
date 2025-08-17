const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener datos de Inicio
router.get("/", (req, res) => {
  db.query("SELECT * FROM inicio LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// Actualizar Inicio
router.put("/:id", (req, res) => {
  const { titulo, descripcion } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE inicio SET titulo = ?, descripcion = ? WHERE id = ?",
    [titulo, descripcion, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Inicio actualizado correctamente" });
    }
  );
});

module.exports = router;
