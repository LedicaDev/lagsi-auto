// backend/routes/servicios.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

// --- Configuración de subida de imágenes ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/servicios");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- GET: Obtener todos los servicios ---
router.get("/", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM servicios ORDER BY orden ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener servicios:", err);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
});

// --- POST: Crear un nuevo servicio ---
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      whatsapp_url,
      contacto_url,
      reunion_url,
      orden,
      visible,
    } = req.body;

    const imagen_url = req.file
      ? `/uploads/servicios/${req.file.filename}`
      : null;

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO servicios (titulo, descripcion, imagen_url, whatsapp_url, contacto_url, reunion_url, orden, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          titulo,
          descripcion,
          imagen_url,
          whatsapp_url,
          contacto_url,
          reunion_url,
          orden,
          visible,
        ]
      );

    res.json({ id: result.insertId, message: "Servicio creado correctamente" });
  } catch (err) {
    console.error("Error al crear servicio:", err);
    res.status(500).json({ error: "Error al crear servicio" });
  }
});

// --- PUT: Actualizar un servicio ---
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      whatsapp_url,
      contacto_url,
      reunion_url,
      orden,
      visible,
    } = req.body;

    let imagen_url = null;
    if (req.file) {
      imagen_url = `/uploads/servicios/${req.file.filename}`;

      // 🗑️ eliminar imagen anterior (si existe)
      const [old] = await db
        .promise()
        .query("SELECT imagen_url FROM servicios WHERE id = ?", [id]);
      if (old.length > 0 && old[0].imagen_url) {
        const oldPath = path.join(__dirname, "..", old[0].imagen_url);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("No se pudo eliminar la imagen anterior:", err);
        });
      }
    }

    await db.promise().query(
      `UPDATE servicios 
         SET titulo=?, descripcion=?, whatsapp_url=?, contacto_url=?, reunion_url=?, orden=?, visible=? ${
           imagen_url ? ", imagen_url=?" : ""
         } 
         WHERE id=?`,
      imagen_url
        ? [
            titulo,
            descripcion,
            whatsapp_url,
            contacto_url,
            reunion_url,
            orden,
            visible,
            imagen_url,
            id,
          ]
        : [
            titulo,
            descripcion,
            whatsapp_url,
            contacto_url,
            reunion_url,
            orden,
            visible,
            id,
          ]
    );

    res.json({ message: "Servicio actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar servicio:", err);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
});

// --- DELETE: Eliminar un servicio ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🗑️ borrar imagen asociada
    const [old] = await db
      .promise()
      .query("SELECT imagen_url FROM servicios WHERE id = ?", [id]);
    if (old.length > 0 && old[0].imagen_url) {
      const oldPath = path.join(__dirname, "..", old[0].imagen_url);
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("No se pudo eliminar la imagen asociada:", err);
      });
    }

    await db.promise().query("DELETE FROM servicios WHERE id = ?", [id]);
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar servicio:", err);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
});

module.exports = router;
