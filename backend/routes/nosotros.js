// backend/routes/nosotros.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

// 📁 Carpeta de subidas para 'nosotros'
const uploadsDir = path.join(__dirname, "..", "uploads", "nosotros");
fs.mkdirSync(uploadsDir, { recursive: true });

// 🧰 Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🚀 GET: lista completa (para el sitio público)
router.get("/", (req, res) => {
  const sql =
    "SELECT id, titulo, descripcion, url, orden FROM nosotros ORDER BY orden ASC, id ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener nosotros:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    return res.json(results);
  });
});

// 🚀 GET: una sola fila por id (para admin)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT id, titulo, descripcion, url, orden FROM nosotros WHERE id=? LIMIT 1";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener nosotros por id:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }
    return res.json(results[0]);
  });
});

// ➕ POST: crear fila (opcional para futuro CRUD)
router.post("/", upload.single("imagen"), (req, res) => {
  const { titulo = "", descripcion = "", orden = 0 } = req.body;
  const url = req.file ? `/uploads/nosotros/${req.file.filename}` : "";

  const sql =
    "INSERT INTO nosotros (titulo, descripcion, url, orden) VALUES (?, ?, ?, ?)";
  db.query(sql, [titulo, descripcion, url, orden], (err, result) => {
    if (err) {
      console.error("❌ Error al insertar:", err);
      return res.status(500).json({ error: "Error al guardar en DB" });
    }
    return res.json({
      message: "Sección creada exitosamente",
      id: result.insertId,
      url,
    });
  });
});

// ✏️ PUT: actualizar fila por id (admin)
router.put("/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, orden } = req.body;

  const sqlSelect =
    "SELECT id, titulo, descripcion, url, orden FROM nosotros WHERE id=? LIMIT 1";
  db.query(sqlSelect, [id], (err, rows) => {
    if (err) {
      console.error("❌ Error al verificar nosotros:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    const current = rows[0];
    const newUrl = req.file
      ? `/uploads/nosotros/${req.file.filename}`
      : current.url;

    const sqlUpdate =
      "UPDATE nosotros SET titulo=?, descripcion=?, url=?, orden=? WHERE id=?";
    db.query(
      sqlUpdate,
      [
        titulo ?? current.titulo,
        descripcion ?? current.descripcion,
        newUrl,
        typeof orden !== "undefined" ? orden : current.orden,
        id,
      ],
      (err2) => {
        if (err2) {
          console.error("❌ Error al actualizar:", err2);
          return res.status(500).json({ error: "Error al actualizar DB" });
        }
        return res.json({
          message: "Sección actualizada exitosamente",
          url: newUrl,
        });
      }
    );
  });
});

// 🗑️ DELETE: eliminar fila por id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM nosotros WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Error al eliminar:", err);
      return res.status(500).json({ error: "Error al eliminar en DB" });
    }
    return res.json({ message: "Sección eliminada exitosamente" });
  });
});

module.exports = router;
