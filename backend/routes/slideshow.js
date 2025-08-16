// backend/routes/slideshow.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// =======================
// Obtener imágenes del slideshow
// =======================
router.get("/", (req, res) => {
  db.query("SELECT * FROM slideshow", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener imágenes" });
    res.json(results);
  });
});

// =======================
// Subir imagen
// =======================
router.post("/", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se envió archivo" });

  const url = `/uploads/${req.file.filename}`;
  db.query("INSERT INTO slideshow (url) VALUES (?)", [url], (err) => {
    if (err) return res.status(500).json({ error: "Error al guardar en BD" });
    res.json({ message: "Imagen subida correctamente", url });
  });
});

// =======================
// Eliminar imagen
// =======================
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT url FROM slideshow WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al buscar imagen" });
    if (!rows.length)
      return res.status(404).json({ error: "Imagen no encontrada" });

    const filePath = path.join(__dirname, `..${rows[0].url}`);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error al borrar archivo:", err);
    });

    db.query("DELETE FROM slideshow WHERE id = ?", [id], (err) => {
      if (err)
        return res.status(500).json({ error: "Error al eliminar de BD" });
      res.json({ message: "Imagen eliminada correctamente" });
    });
  });
});

module.exports = router;
