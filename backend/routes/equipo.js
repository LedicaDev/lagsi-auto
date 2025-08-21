const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

// 📂 Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/equipo");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // ejemplo: 17123456789.png
    );
  },
});
const upload = multer({ storage });

// 📌 GET: Listar todos los miembros
router.get("/", (req, res) => {
  const sql = "SELECT * FROM equipo ORDER BY orden ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener equipo" });
    res.json(results);
  });
});

// 📌 POST: Crear nuevo miembro
router.post("/", upload.single("imagen"), (req, res) => {
  const { nombre, cargo, descripcion, orden, visible } = req.body;
  const imagen_url = req.file ? `/uploads/equipo/${req.file.filename}` : null;

  const sql =
    "INSERT INTO equipo (nombre, cargo, descripcion, imagen_url, orden, visible) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [nombre, cargo, descripcion, imagen_url, orden, visible || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear miembro" });
      res.json({ message: "Miembro creado", id: result.insertId });
    }
  );
});

// 📌 PUT: Actualizar miembro
router.put("/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;
  const { nombre, cargo, descripcion, orden, visible } = req.body;
  let sql;
  let values;

  if (req.file) {
    const imagen_url = `/uploads/equipo/${req.file.filename}`;
    sql =
      "UPDATE equipo SET nombre=?, cargo=?, descripcion=?, imagen_url=?, orden=?, visible=? WHERE id=?";
    values = [nombre, cargo, descripcion, imagen_url, orden, visible || 0, id];
  } else {
    sql =
      "UPDATE equipo SET nombre=?, cargo=?, descripcion=?, orden=?, visible=? WHERE id=?";
    values = [nombre, cargo, descripcion, orden, visible || 0, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.json({ message: "Miembro actualizado" });
  });
});

// 📌 DELETE: Eliminar miembro
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Primero obtener imagen para borrarla del servidor
  db.query("SELECT imagen_url FROM equipo WHERE id=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error en la consulta" });

    if (rows.length > 0 && rows[0].imagen_url) {
      const imagePath = path.join(__dirname, "..", rows[0].imagen_url);
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) console.error("No se pudo borrar la imagen:", unlinkErr);
      });
    }

    // Luego eliminar el registro
    db.query("DELETE FROM equipo WHERE id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Error al eliminar" });
      res.json({ message: "Miembro eliminado" });
    });
  });
});

module.exports = router;
