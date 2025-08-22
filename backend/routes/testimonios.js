// backend/routes/testimonios.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ GET - Listar testimonios
router.get("/", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM testimonios ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener testimonios:", err);
    res.status(500).json({ error: "Error al obtener testimonios" });
  }
});

// ✅ POST - Crear testimonio
router.post("/", async (req, res) => {
  try {
    const { titulo, url } = req.body;
    if (!titulo || !url) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    await db
      .promise()
      .query("INSERT INTO testimonios (titulo, url) VALUES (?, ?)", [
        titulo,
        url,
      ]);

    res.json({ message: "✅ Testimonio creado exitosamente" });
  } catch (err) {
    console.error("❌ Error al crear testimonio:", err);
    res.status(500).json({ error: "Error al crear testimonio" });
  }
});

// ✅ PUT - Editar testimonio
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, url } = req.body;

    console.log("📌 Body recibido:", req.body);
    console.log("📌 Params recibido:", req.params);

    if (!titulo || !url) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    await db
      .promise()
      .query("UPDATE testimonios SET titulo = ?, url = ? WHERE id = ?", [
        titulo,
        url,
        id,
      ]);

    res.json({ message: "✅ Testimonio actualizado exitosamente" });
  } catch (err) {
    console.error("❌ Error al actualizar testimonio:", err);
    res.status(500).json({ error: "Error al actualizar testimonio" });
  }
});

// ✅ DELETE - Eliminar testimonio
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM testimonios WHERE id = ?", [id]);
    res.json({ message: "🗑️ Testimonio eliminado exitosamente" });
  } catch (err) {
    console.error("❌ Error al eliminar testimonio:", err);
    res.status(500).json({ error: "Error al eliminar testimonio" });
  }
});

module.exports = router;
