// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error en base de datos" });
      if (results.length === 0)
        return res.status(401).json({ error: "Usuario no encontrado" });

      const usuario = results[0];

      bcrypt.compare(password, usuario.password_hash, (err, match) => {
        if (err || !match)
          return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
          {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // en producción debe ser true con HTTPS
          sameSite: "strict",
          maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.json({
          message: "Login exitoso",
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
          },
        });
      });
    }
  );
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada" });
});

// RUTA PROTEGIDA EJEMPLO
router.get("/me", verifyToken, (req, res) => {
  res.json({ usuario: req.user });
});

module.exports = router;
