import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/adminEquipo.css";

const AdminEquipo = () => {
  const [miembros, setMiembros] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    cargo: "",
    descripcion: "",
    orden: 1,
    visible: true,
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // 🔹 Cargar equipo
  useEffect(() => {
    fetchEquipo();
  }, []);

  const fetchEquipo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipo");
      setMiembros(res.data);
    } catch (err) {
      console.error("Error al cargar equipo:", err);
    }
  };

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // 🔹 Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (imagen) formData.append("imagen", imagen);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/equipo/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://localhost:5000/api/equipo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchEquipo();
    } catch (err) {
      console.error("Error al guardar miembro:", err);
    }
  };

  // 🔹 Editar
  const handleEdit = (miembro) => {
    setForm({
      nombre: miembro.nombre,
      cargo: miembro.cargo,
      descripcion: miembro.descripcion,
      orden: miembro.orden,
      visible: miembro.visible === 1,
    });
    setPreview(`http://localhost:5000${miembro.imagen_url}`);
    setEditingId(miembro.id);
  };

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este miembro?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/equipo/${id}`);
      fetchEquipo();
    } catch (err) {
      console.error("Error al eliminar miembro:", err);
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setForm({
      nombre: "",
      cargo: "",
      descripcion: "",
      orden: 1,
      visible: true,
    });
    setImagen(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="admin-equipo">
      <h2>Administrar Equipo</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="equipo-form">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="cargo"
          value={form.cargo}
          onChange={handleChange}
          placeholder="Cargo"
          required
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          rows="3"
          required
        />
        <input
          type="number"
          name="orden"
          value={form.orden}
          onChange={handleChange}
          placeholder="Orden"
        />
        <label>
          <input
            type="checkbox"
            name="visible"
            checked={form.visible}
            onChange={handleChange}
          />
          Visible
        </label>
        <input type="file" onChange={handleImageChange} accept="image/*" />

        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de miembros */}
      <table className="equipo-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Visible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {miembros.map((m) => (
            <tr key={m.id}>
              <td>
                {m.imagen_url && (
                  <img
                    src={`http://localhost:5000${m.imagen_url}`}
                    alt={m.nombre}
                    className="miniatura"
                  />
                )}
              </td>
              <td>{m.nombre}</td>
              <td>{m.cargo}</td>
              <td>{m.descripcion}</td>
              <td>{m.orden}</td>
              <td>{m.visible ? "Sí" : "No"}</td>
              <td className="acciones">
                <button className="btn-edit" onClick={() => handleEdit(m)}>
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(m.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEquipo;
