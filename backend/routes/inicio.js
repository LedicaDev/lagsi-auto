// backend/routes/inicio.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/inicio"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ GET /api/inicio → trae 1 registro
router.get("/", (req, res) => {
  db.query(
    "SELECT id, titulo, descripcion, imagen_url FROM inicio ORDER BY id DESC LIMIT 1",
    (err, results) => {
      if (err) {
        console.error("❌ Error en DB:", err);
        return res.status(500).json({ error: "Error en base de datos" });
      }
      if (results.length === 0) {
        return res.json({
          id: null,
          titulo: "",
          descripcion: "",
          imagen_url: "",
        });
      }
      res.json(results[0]);
    }
  );
});

// ✅ PUT /api/inicio → actualiza o crea registro
router.put("/", upload.single("imagen"), (req, res) => {
  const { titulo, descripcion } = req.body;
  let imagen_url = null;

  if (req.file) {
    imagen_url = `/uploads/inicio/${req.file.filename}`;
  }

  db.query("SELECT id FROM inicio LIMIT 1", (err, results) => {
    if (err) {
      console.error("❌ Error en DB:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }

    if (results.length > 0) {
      const id = results[0].id;
      const sql =
        "UPDATE inicio SET titulo = ?, descripcion = ?, imagen_url = ? WHERE id = ?";
      db.query(sql, [titulo, descripcion, imagen_url, id], (err2) => {
        if (err2) {
          console.error("❌ Error al actualizar:", err2);
          return res.status(500).json({ error: "Error al actualizar" });
        }
        return res.json({
          message: "Inicio actualizado",
          imagen_url,
        });
      });
    } else {
      const sql =
        "INSERT INTO inicio (titulo, descripcion, imagen_url) VALUES (?, ?, ?)";
      db.query(sql, [titulo, descripcion, imagen_url], (err2, result) => {
        if (err2) {
          console.error("❌ Error al crear:", err2);
          return res.status(500).json({ error: "Error al crear" });
        }
        return res.json({
          message: "Inicio creado",
          id: result.insertId,
          imagen_url,
        });
      });
    }
  });
});

module.exports = router;
