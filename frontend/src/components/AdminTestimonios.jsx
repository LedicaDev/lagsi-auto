// frontend/src/components/AdminTestimonios.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/css/adminTestimonios.css";

const API_URL = "http://localhost:5000/api/testimonios";

const AdminTestimonios = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [formData, setFormData] = useState({ titulo: "", url: "" });
  const [editing, setEditing] = useState(null);

  // ✅ Cargar testimonios
  useEffect(() => {
    fetchTestimonios();
  }, []);

  const fetchTestimonios = async () => {
    try {
      const res = await axios.get(API_URL);
      setTestimonios(res.data);
    } catch (err) {
      console.error("Error al cargar testimonios:", err);
      Swal.fire("Error", "No se pudieron cargar los testimonios", "error");
    }
  };

  // ✅ Manejo de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Crear / Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing}`, formData);
        Swal.fire("Actualizado", "El testimonio fue actualizado", "success");
      } else {
        await axios.post(API_URL, formData);
        Swal.fire("Creado", "Nuevo testimonio agregado", "success");
      }
      fetchTestimonios();
      resetForm();
    } catch (err) {
      console.error("Error al guardar testimonio:", err);
      Swal.fire("Error", "No se pudo guardar el testimonio", "error");
    }
  };

  // ✅ Editar
  const handleEdit = (testimonio) => {
    setEditing(testimonio.id);
    setFormData({ titulo: testimonio.titulo, url: testimonio.url });
  };

  // ✅ Eliminar
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTestimonios();
      Swal.fire("Eliminado", "El testimonio fue eliminado", "success");
    } catch (err) {
      console.error("Error al eliminar testimonio:", err);
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  // ✅ Reset formulario
  const resetForm = () => {
    setEditing(null);
    setFormData({ titulo: "", url: "" });
  };

  return (
    <div className="admin-container">
      <h3>Administrar Testimonios</h3>

      {/* Tabla */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Video</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {testimonios.length > 0 ? (
              testimonios.map((t) => (
                <tr key={t.id}>
                  <td>{t.titulo}</td>
                  <td>
                    <iframe
                      width="200"
                      height="120"
                      src={t.url}
                      title={t.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(t)}>
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay testimonios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario */}
      <div className="form-container">
        <h4>{editing ? "Editar Testimonio" : "Crear Testimonio"}</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="url"
            placeholder="URL del video"
            value={formData.url}
            onChange={handleChange}
            required
          />

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

export default AdminTestimonios;
