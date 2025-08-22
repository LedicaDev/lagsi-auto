// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Middleware para verificar token y rol admin (usa cookie httpOnly)
function verifyToken(req, res, next) {
  const token = req.cookies?.token; // viene de la cookie
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
}

// ✅ GET - Listar usuarios
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC"
      );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// ✅ POST - Crear usuario (con validación de correo único)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    let { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    email = String(email).trim().toLowerCase();

    // 🔎 Verificar si ya existe un usuario con ese email
    const [existing] = await db
      .promise()
      .query("SELECT id FROM usuarios WHERE email = ? LIMIT 1", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db
      .promise()
      .query(
        "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)",
        [nombre, email, hashedPassword, rol]
      );

    res.json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    // Por si existe índice UNIQUE en email
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// ✅ PUT - Editar usuario (valida email duplicado si cambia)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !rol) {
      return res
        .status(400)
        .json({ error: "Nombre, email y rol son obligatorios" });
    }

    email = String(email).trim().toLowerCase();

    // 🔎 Validar si el nuevo email pertenece a otro usuario
    const [existing] = await db
      .promise()
      .query("SELECT id FROM usuarios WHERE email = ? AND id != ? LIMIT 1", [
        email,
        id,
      ]);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "El correo ya está en uso por otro usuario" });
    }

    let query =
      "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?";
    let params = [nombre, email, rol, id];

    // Si viene un nuevo password, actualizar también
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query =
        "UPDATE usuarios SET nombre = ?, email = ?, rol = ?, password_hash = ? WHERE id = ?";
      params = [nombre, email, rol, hashedPassword, id];
    }

    await db.promise().query(query, params);
    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "El correo ya está en uso por otro usuario" });
    }
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// ✅ DELETE - Eliminar usuario
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
