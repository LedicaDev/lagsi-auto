const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");

// ✅ Obtener lista de usuarios (solo admin)
router.get("/", authenticateToken, (req, res) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  db.query("SELECT id, nombre, email, rol FROM usuarios", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener usuarios" });
    res.json(results);
  });
});

// ✅ Crear usuario (ya existe en auth.js, pero lo dejo por si quieres centralizar aquí)
router.post("/", authenticateToken, (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error de base de datos" });
      if (results.length > 0) {
        return res.status(409).json({ error: "El email ya está registrado" });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error al encriptar contraseña" });

        db.query(
          "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)",
          [nombre, email, hash, rol || "editor"],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ error: "Error al registrar usuario" });
            res.json({ message: "Usuario registrado exitosamente" });
          }
        );
      });
    }
  );
});

// ✅ Editar usuario
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  const updateUser = () => {
    db.query(
      "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
      [nombre, email, rol, id],
      (err) => {
        if (err)
          return res.status(500).json({ error: "Error al actualizar usuario" });
        res.json({ message: "Usuario actualizado exitosamente" });
      }
    );
  };

  if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err)
        return res.status(500).json({ error: "Error al encriptar contraseña" });
      db.query(
        "UPDATE usuarios SET nombre = ?, email = ?, password_hash = ?, rol = ? WHERE id = ?",
        [nombre, email, hash, rol, id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al actualizar usuario" });
          res.json({ message: "Usuario actualizado exitosamente" });
        }
      );
    });
  } else {
    updateUser();
  }
});

// ✅ Eliminar usuario
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar usuario" });
    res.json({ message: "Usuario eliminado correctamente" });
  });
});

module.exports = router;
