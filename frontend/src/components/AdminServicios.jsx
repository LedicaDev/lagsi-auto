// frontend/src/components/AdminServicios.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/css/adminServicios.css";

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [editing, setEditing] = useState(null); // null = creando, id = editando
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: null,
    whatsapp_url: "",
    contacto_url: "",
    reunion_url: "",
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/servicios");
      setServicios(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los servicios.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      data.append("whatsapp_url", formData.whatsapp_url);
      data.append("contacto_url", formData.contacto_url);
      data.append("reunion_url", formData.reunion_url);
      if (formData.imagen) data.append("imagen", formData.imagen);

      if (editing) {
        await axios.put(`http://localhost:5000/api/servicios/${editing}`, data);
        Swal.fire("Éxito", "Servicio actualizado correctamente.", "success");
      } else {
        await axios.post("http://localhost:5000/api/servicios", data);
        Swal.fire("Éxito", "Servicio creado correctamente.", "success");
      }

      setFormData({
        titulo: "",
        descripcion: "",
        imagen: null,
        whatsapp_url: "",
        contacto_url: "",
        reunion_url: "",
      });
      setEditing(null);
      fetchServicios();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el servicio.", "error");
    }
  };

  const handleEdit = (srv) => {
    setEditing(srv.id);
    setFormData({
      titulo: srv.titulo,
      descripcion: srv.descripcion,
      imagen: null,
      whatsapp_url: srv.whatsapp_url,
      contacto_url: srv.contacto_url,
      reunion_url: srv.reunion_url,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar servicio?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/servicios/${id}`);
      setServicios(servicios.filter((s) => s.id !== id));
      Swal.fire(
        "Eliminado",
        "El servicio fue eliminado correctamente.",
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el servicio.", "error");
    }
  };

  return (
    <div className="admin-servicios">
      <h3>Gestión de Servicios</h3>

      {/* Formulario Crear/Editar */}
      <form className="srv-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="whatsapp_url"
          placeholder="WhatsApp URL"
          value={formData.whatsapp_url}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contacto_url"
          placeholder="Contacto URL"
          value={formData.contacto_url}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reunion_url"
          placeholder="Reunión URL"
          value={formData.reunion_url}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">
          {editing ? "Actualizar Servicio" : "Crear Servicio"}
        </button>
        {editing && (
          <button type="button" onClick={() => setEditing(null)}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de Servicios */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((srv) => (
            <tr key={srv.id}>
              <td>
                <img
                  src={`http://localhost:5000${srv.imagen_url}`}
                  alt={srv.titulo}
                  className="mini-img"
                />
              </td>
              <td>{srv.titulo}</td>
              <td className="truncate">{srv.descripcion}</td>
              <td>
                <div className="srv-actions">
                  <button className="btn-edit" onClick={() => handleEdit(srv)}>
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(srv.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminServicios;
