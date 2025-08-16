require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir cookies
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true,
  })
);

// Cookies
app.use(cookieParser());

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// ✅ Ruta para validar autenticación usando la cookie
app.get("/api/checkAuth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ok: true, usuario: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

// Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
