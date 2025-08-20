// backend/routes/slideshow.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db"); // tu conexión mysql2

const router = express.Router();

// 📂 Carpeta de subida
const uploadDir = path.join(__dirname, "../uploads/slideshow");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =====================
// 📌 GET imágenes
// =====================
router.get("/", (req, res) => {
  db.query("SELECT * FROM slideshow", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener slideshow:", err);
      return res.status(500).json({ error: "Error al obtener slideshow" });
    }
    res.json(results);
  });
});

// =====================
// 📌 POST subir imagen
// =====================
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }

  const filePath = `/uploads/slideshow/${req.file.filename}`;

  db.query(
    "INSERT INTO slideshow (url) VALUES (?)",
    [filePath],
    (err, result) => {
      if (err) {
        console.error("❌ Error al guardar en DB:", err);
        return res.status(500).json({ error: "Error al guardar la imagen" });
      }
      res.json({
        message: "✅ Imagen subida con éxito",
        url: filePath,
        id: result.insertId,
      });
    }
  );
});

// =====================
// 📌 DELETE eliminar imagen
// =====================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // 1. Buscar imagen en DB
  db.query("SELECT url FROM slideshow WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al buscar imagen:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const imagePath = path.join(__dirname, "..", results[0].url);

    // 2. Eliminar de DB
    db.query("DELETE FROM slideshow WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("❌ Error al eliminar de DB:", err);
        return res.status(500).json({ error: "Error al eliminar la imagen" });
      }

      // 3. Eliminar archivo físico
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.warn(
            "⚠️ No se pudo eliminar el archivo físico:",
            unlinkErr.message
          );
        }
      });

      res.json({ message: "🗑️ Imagen eliminada correctamente" });
    });
  });
});

module.exports = router;
