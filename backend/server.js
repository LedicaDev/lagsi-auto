// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Rutas
const authRoutes = require("./routes/auth");
const inicioRoutes = require("./routes/inicio");

const app = express();

// --- Asegurar carpetas necesarias (para subidas de imágenes) ---
const uploadsRoot = path.join(__dirname, "uploads");
const uploadsInicio = path.join(uploadsRoot, "inicio");
fs.mkdirSync(uploadsInicio, { recursive: true });

// --- Middlewares globales ---
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (sirve /uploads/*)
app.use("/uploads", express.static(uploadsRoot));

// --- Rutas de API ---
app.use("/api", authRoutes); // /api/login, /api/logout, /api/me...
app.use("/api/inicio", inicioRoutes); // GET/PUT /api/inicio

// ✅ Ruta para validar autenticación usando la cookie
app.get("/api/checkAuth", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ok: true, usuario: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

// --- Arrancar servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
