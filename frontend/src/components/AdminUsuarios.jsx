// frontend/src/components/AdminUsuarios.jsx
import { useEffect, useState, useCallback } from "react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "editor",
  });

  const token = sessionStorage.getItem("token");

  // 📌 Función para traer usuarios (memorizada para evitar warning de useEffect)
  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch("/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  }, [token]);

  // 📌 Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // 📌 Manejar cambios en campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📌 Registrar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al registrar usuario");
        return;
      }

      alert("Usuario registrado exitosamente");
      setForm({ nombre: "", email: "", password: "", rol: "editor" });
      fetchUsuarios(); // refrescar lista
    } catch (error) {
      console.error("Error registrando usuario:", error);
    }
  };

  return (
    <div className="admin-usuarios">
      <h2>Administrar Usuarios</h2>

      {/* Formulario para crear usuario */}
      <form onSubmit={handleSubmit} className="form-usuarios">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrar Usuario</button>
      </form>

      {/* Lista de usuarios */}
      <h3>Lista de Usuarios</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
