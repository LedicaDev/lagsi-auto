// frontend/src/components/AdminTestimonios.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminTestimonios = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const fetchTestimonios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/testimonios");
      setTestimonios(res.data);
    } catch (error) {
      console.error("Error al cargar testimonios:", error);
      setMensaje("No se pudieron cargar los testimonios.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Editar testimonio
        await axios.put(`http://localhost:5000/api/testimonios/${editId}`, {
          titulo,
          url,
        });
        setMensaje("Testimonio actualizado correctamente.");
      } else {
        // Crear testimonio nuevo
        await axios.post("http://localhost:5000/api/testimonios", {
          titulo,
          url,
        });
        setMensaje("Testimonio agregado correctamente.");
      }

      setTitulo("");
      setUrl("");
      setEditId(null);
      fetchTestimonios();
    } catch (error) {
      console.error("Error al guardar testimonio:", error);
      setMensaje("Error al guardar el testimonio.");
    }
  };

  const handleEdit = (testimonio) => {
    setTitulo(testimonio.titulo);
    setUrl(testimonio.url);
    setEditId(testimonio.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este testimonio?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/testimonios/${id}`);
      setMensaje("Testimonio eliminado correctamente.");
      fetchTestimonios();
    } catch (error) {
      console.error("Error al eliminar testimonio:", error);
      setMensaje("Error al eliminar el testimonio.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Administrar Testimonios</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <label>
            <strong>Título:</strong>
          </label>
          <br />
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: "60%", marginBottom: "1rem" }}
            required
          />
        </div>

        <div>
          <label>
            <strong>URL del video:</strong>
          </label>
          <br />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "60%", marginBottom: "1rem" }}
            required
          />
        </div>

        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h3>Lista de Testimonios</h3>
      {testimonios.length === 0 ? (
        <p>No hay testimonios registrados.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "300px",
                textAlign: "center",
              }}
            >
              <h4>{testimonio.titulo}</h4>
              <iframe
                width="100%"
                height="180"
                src={testimonio.url}
                title={testimonio.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleEdit(testimonio)}>Editar</button>
                <button
                  onClick={() => handleDelete(testimonio.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonios;
