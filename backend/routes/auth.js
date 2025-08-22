// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Guardar cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔴 ponlo en true si usas HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // Mandamos al frontend los datos del usuario (sin password)
    res.json({
      message: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ✅ LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout exitoso" });
});

module.exports = router;
