// frontend/src/components/AdminUsuarios.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/css/adminUsuarios.css";

const API_URL = "http://localhost:5000/api/usuarios";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "editor",
  });

  // ✅ Cargar usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Error al cargar usuarios",
      });
    }
  };

  // ✅ Manejo de inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Crear usuario
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, { withCredentials: true });
      await fetchUsuarios();
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario creado exitosamente",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: err.response?.data?.error || "No se pudo crear el usuario",
      });
    }
  };

  // ✅ Editar usuario
  const handleEdit = (usuario) => {
    setEditing(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "", // no se precarga por seguridad
      rol: usuario.rol,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editing}`, formData, {
        withCredentials: true,
      });
      await fetchUsuarios();
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Usuario actualizado exitosamente",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.response?.data?.error || "No se pudo actualizar el usuario",
      });
    }
  };

  // ✅ Eliminar usuario (SweetAlert2)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Seguro que deseas eliminar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      await fetchUsuarios();
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Usuario eliminado exitosamente",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: err.response?.data?.error || "No se pudo eliminar el usuario",
      });
    }
  };

  // ✅ Resetear formulario
  const resetForm = () => {
    setEditing(null);
    setFormData({
      nombre: "",
      email: "",
      password: "",
      rol: "editor",
    });
  };

  return (
    <div className="admin-container">
      <h3>Administrar Usuarios</h3>

      {/* Tabla usuarios */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
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

      {/* Formulario */}
      <div className="form-container">
        <h4>{editing ? "Editar Usuario" : "Crear Usuario"}</h4>
        <form onSubmit={editing ? handleUpdate : handleCreate}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={editing ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={formData.password}
            onChange={handleChange}
          />
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editing ? "Actualizar" : "Crear"}
            </button>
            {editing && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsuarios;
