// backend/routes/nosotros.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const multer = require("multer");

const router = express.Router();

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Cambia si tienes contraseña
  database: "lagsi_auto",
});

/* ============================================================
   CONFIGURACIÓN MULTER SOLO PARA NOSOTROS
   ============================================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/nosotros");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ============================================================
   RUTAS
   ============================================================ */

// 📌 Obtener todas las secciones de Nosotros
router.get("/", (req, res) => {
  db.query("SELECT * FROM nosotros ORDER BY orden ASC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener datos" });
    }
    const data = results.map((item) => ({
      ...item,
      imagen: item.imagen ? `http://localhost:5000${item.imagen}` : null,
    }));
    res.json(data);
  });
});

// 📌 Crear nueva sección
router.post("/", upload.single("imagen"), (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo || !descripcion) {
    return res
      .status(400)
      .json({ error: "Título y descripción son requeridos" });
  }
  const imagenPath = req.file ? `/uploads/nosotros/${req.file.filename}` : null;

  db.query(
    "INSERT INTO nosotros (titulo, descripcion, imagen) VALUES (?, ?, ?)",
    [titulo, descripcion, imagenPath],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al guardar en la base de datos" });
      }
      res.json({
        id: result.insertId,
        titulo,
        descripcion,
        imagen: imagenPath ? `http://localhost:5000${imagenPath}` : null,
        message: "Sección creada correctamente",
      });
    }
  );
});

// 📌 Actualizar sección existente
router.put("/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;

  db.query("SELECT * FROM nosotros WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const actual = rows[0];
    const imagenPath = req.file
      ? `/uploads/nosotros/${req.file.filename}`
      : actual.imagen;

    db.query(
      "UPDATE nosotros SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?",
      [
        titulo || actual.titulo,
        descripcion || actual.descripcion,
        imagenPath,
        id,
      ],
      (err2) => {
        if (err2) {
          return res
            .status(500)
            .json({ error: "Error al actualizar el registro" });
        }
        res.json({ message: "Sección actualizada correctamente" });
      }
    );
  });
});

// 📌 Eliminar sección
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT imagen FROM nosotros WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const filePath = rows[0].imagen
      ? path.join(__dirname, "..", rows[0].imagen)
      : null;
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    db.query("DELETE FROM nosotros WHERE id = ?", [id], (err2) => {
      if (err2) {
        return res.status(500).json({ error: "Error al eliminar el registro" });
      }
      res.json({ message: "Sección eliminada correctamente" });
    });
  });
});

module.exports = router;
