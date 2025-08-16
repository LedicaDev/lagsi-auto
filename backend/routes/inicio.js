const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener descripcion
router.get("/", (req, res) => {
  db.query("SELECT * FROM inicio_descripcion LIMIT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// Actualizar descripcion
router.put("/", (req, res) => {
  const { titulo, descripcion } = req.body;
  db.query(
    "UPDATE inicio_descripcion SET titulo = ?, descripcion = ? WHERE id = 1",
    [titulo, descripcion],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

module.exports = router;
