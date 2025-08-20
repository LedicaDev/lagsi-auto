import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "../assets/css/adminNosotros.css";

const AdminNosotros = () => {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  // ✅ Editor Quill
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  });

  // 🔧 Listener para escritura manual
  useEffect(() => {
    if (!quill) return;
    const handler = () => {
      setContenido(quill.root.innerHTML);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  // 🔧 Inyectar contenido en Quill cuando editamos
  useEffect(() => {
    if (quill && formVisible) {
      quill.root.innerHTML = contenido || "";
    }
  }, [quill, contenido, formVisible]);

  // 📌 Cargar datos desde DB
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/nosotros");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error cargando Nosotros:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📌 Subida de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 📌 Guardar (crear/editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", contenido);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:5000/api/nosotros/${editId}`
        : "http://localhost:5000/api/nosotros";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMensaje(result.message || "Operación exitosa");
        // ✅ Reload completo y volver a AdminNosotros
        window.location.href = "/panel?tab=admin-nosotros";
      } else {
        setMensaje(result.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  // 📌 Editar
  const handleEdit = (item) => {
    setEditId(item.id);
    setTitulo(item.titulo || "");
    setContenido(item.descripcion || "");
    setImagen(null);
    setPreview(item.url ? `http://localhost:5000${item.url}` : null);
    setFormVisible(true);
  };

  // 📌 Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro de eliminar este registro?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/nosotros/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        setMensaje(result.message || "Eliminado exitosamente");
        fetchData();
      } else {
        setMensaje(result.error || "Error al eliminar");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // 📌 Cancelar
  const handleCancel = () => {
    window.location.href = "/panel?tab=admin-nosotros";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Gestión de Nosotros</h2>

      {/* 📌 Listado */}
      <table className="admin-nosotros-table">
        <thead>
          <tr>
            <th style={{ width: "50px" }}>ID</th>
            <th style={{ width: "150px" }}>Título</th>
            <th style={{ width: "300px" }}>Descripción</th>
            <th style={{ width: "150px" }}>Imagen</th>
            <th style={{ width: "150px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.titulo}</td>
                <td className="admin-nosotros-desc">
                  {(item.descripcion || "")
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 100)}
                  {item.descripcion && item.descripcion.length > 100 && "..."}
                </td>
                <td>
                  {item.url && (
                    <img
                      src={`http://localhost:5000${item.url}`}
                      alt={item.titulo}
                      className="admin-nosotros-img"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(item)} className="btn-edit">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay registros aún.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 📌 Formulario */}
      {formVisible && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label>
              <strong>Título:</strong>
            </label>
            <br />
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={{ width: "80%", marginBottom: "1rem" }}
            />
          </div>
          <div>
            <label>
              <strong>Descripción (texto enriquecido):</strong>
            </label>
            <div
              ref={quillRef}
              style={{
                height: "250px",
                marginBottom: "1rem",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div>
            <label>
              <strong>Imagen:</strong>
            </label>
            <br />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {preview && (
            <div style={{ marginTop: "1rem" }}>
              <p>Vista previa:</p>
              <img
                src={preview}
                alt="preview"
                style={{ width: "150px", border: "1px solid #ccc" }}
              />
            </div>
          )}
          <br />
          <button type="submit">Guardar Cambios</button>{" "}
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AdminNosotros;
