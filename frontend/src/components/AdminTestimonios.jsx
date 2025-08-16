import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/panelAdmin.css";

const AdminTestimonios = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔹 Función para convertir URL normal a embed
  const convertirAEmbed = (link) => {
    try {
      if (!link) return "";
      if (link.includes("youtube.com/embed/")) return link; // Ya es embed

      let videoId = "";
      if (link.includes("watch?v=")) {
        const urlObj = new URL(link);
        videoId = urlObj.searchParams.get("v");
      } else if (link.includes("youtu.be/")) {
        videoId = link.split("youtu.be/")[1];
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : link;
    } catch {
      return link;
    }
  };

  const fetchTestimonios = async () => {
    const res = await axios.get("http://localhost:5000/api/testimonios");
    setTestimonios(res.data);
  };

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlEmbed = convertirAEmbed(url);

    if (editId) {
      await axios.put(`http://localhost:5000/api/testimonios/${editId}`, {
        titulo,
        url: urlEmbed,
      });
    } else {
      await axios.post("http://localhost:5000/api/testimonios", {
        titulo,
        url: urlEmbed,
      });
    }

    setTitulo("");
    setUrl("");
    setEditId(null);
    fetchTestimonios();
  };

  const handleEdit = (testimonio) => {
    setEditId(testimonio.id);
    setTitulo(testimonio.titulo);
    setUrl(testimonio.url);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este testimonio?")) {
      await axios.delete(`http://localhost:5000/api/testimonios/${id}`);
      fetchTestimonios();
    }
  };

  return (
    <div className="admin-container">
      <h2>Administrar Testimonios</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Título del video"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL de YouTube"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
      </form>

      <div className="admin-list">
        {testimonios.map((t) => (
          <div key={t.id} className="admin-item">
            <p>
              <strong>{t.titulo}</strong>
            </p>
            <iframe
              src={t.url}
              title={t.titulo}
              width="300"
              height="170"
              allowFullScreen
            ></iframe>
            <div className="admin-actions">
              <button onClick={() => handleEdit(t)}>Editar</button>
              <button onClick={() => handleDelete(t.id)} className="delete-btn">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonios;
