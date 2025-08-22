// frontend/src/components/AdminNosotros.jsx
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Swal from "sweetalert2";
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

  // ✅ Quill
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

  // Mantener contenido del editor en el estado
  useEffect(() => {
    if (!quill) return;
    const onChange = () => setContenido(quill.root.innerHTML);
    quill.on("text-change", onChange);
    return () => quill.off("text-change", onChange);
  }, [quill]);

  // Inyectar contenido en Quill cuando abrimos el formulario (editar o crear)
  useEffect(() => {
    if (quill && formVisible) {
      // Si contenido viene vacío, limpiamos; si no, colocamos el HTML.
      quill.root.innerHTML = contenido || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, formVisible, contenido]);

  // Cargar datos desde DB
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/nosotros", {
        credentials: "include",
      });
      const data = await res.json();
      // Aceptar tanto objeto único como array
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error cargando Nosotros:", err);
      setMensaje("Error al cargar datos de Nosotros.");
      Swal.fire(
        "Error",
        "No se pudieron cargar los datos de Nosotros",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejo input archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Crear / Editar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!titulo?.trim()) {
      Swal.fire("Atención", "El título es obligatorio", "warning");
      return;
    }
    // El contenido puede estar vacío (si se desea), pero aquí alertamos si no hay nada
    if (!contenido || contenido === "<p><br></p>") {
      // permitir, pero avisar al usuario
      const r = await Swal.fire({
        title: "Sin contenido",
        text: "No has agregado contenido enriquecido. ¿Deseas continuar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      });
      if (!r.isConfirmed) return;
    }

    try {
      const fd = new FormData();
      fd.append("titulo", titulo);
      fd.append("descripcion", contenido);
      if (imagen) fd.append("imagen", imagen);

      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:5000/api/nosotros/${editId}`
        : "http://localhost:5000/api/nosotros";

      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setMensaje(result.message || "Operación exitosa");
        Swal.fire(
          "Correcto",
          result.message || "Guardado correctamente",
          "success"
        );
        // refrescar datos y limpiar formulario sin recargar toda la página
        await fetchData();
        resetForm();
        // dejar la vista en el tab (sin navegar). Si quieres que el form se oculte:
        setFormVisible(false);
      } else {
        setMensaje(result.error || "Error al guardar");
        Swal.fire("Error", result.error || "Error al guardar", "error");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Error de conexión con el servidor.");
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  // Editar: precargar formulario y mostrar
  const handleEdit = (item) => {
    setEditId(item.id);
    setTitulo(item.titulo || "");
    setContenido(item.descripcion || "");
    setImagen(null);
    // admitir tanto item.url como item.imagen_url
    const imagePath = item.url || item.imagen_url || null;
    setPreview(imagePath ? `http://localhost:5000${imagePath}` : null);

    // mostrar el formulario (el useEffect inyectará el contenido en Quill)
    setFormVisible(true);

    // Si quill ya está listo, inyectamos inmediatamente (por si formVisible ya era true)
    if (quill) {
      // small timeout to ensure the quill element is mounted
      setTimeout(() => {
        quill.root.innerHTML = item.descripcion || "";
      }, 0);
    }
  };

  // Eliminar con SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas eliminar este registro?",
      text: "Esta acción no puede deshacerse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/nosotros/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const resultJson = await res.json();
      if (res.ok) {
        setMensaje(resultJson.message || "Eliminado exitosamente");
        Swal.fire(
          "Eliminado",
          resultJson.message || "Registro eliminado",
          "success"
        );
        fetchData();
      } else {
        setMensaje(resultJson.error || "Error al eliminar");
        Swal.fire("Error", resultJson.error || "Error al eliminar", "error");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      Swal.fire("Error", "Error al eliminar el registro", "error");
    }
  };

  // Cancelar edición / creación sin recargar: resetea el formulario y el editor
  const handleCancel = () => {
    // si quieres que el usuario confirme al cancelar (opcional), descomenta:
    // if (!window.confirm("¿Deseas cancelar? Los cambios no guardados se perderán.")) return;
    resetForm();
    setFormVisible(false);
    setMensaje("");
    // limpiar Quill si está disponible
    if (quill) {
      setTimeout(() => {
        try {
          quill.root.innerHTML = "";
        } catch (e) {
          // ignore
        }
      }, 0);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitulo("");
    setContenido("");
    setImagen(null);
    setPreview(null);
  };

  // Opción útil: permitir crear nuevo registro (muestra formulario vacío)
  const handleCreateNew = () => {
    resetForm();
    setFormVisible(true);
    // asegurar quill vacío
    if (quill) {
      setTimeout(() => (quill.root.innerHTML = ""), 0);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Gestión de Nosotros</h2>
        <div>
          {/* botón para crear nuevo (no rompe estilos, puedes ocultarlo si no hace falta) */}
          <button
            onClick={handleCreateNew}
            style={{ marginRight: 10 }}
            className="btn-create"
          >
            + Agregar nuevo
          </button>
        </div>
      </div>

      {/* Listado */}
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
                  {item.descripcion &&
                    item.descripcion.replace(/<[^>]+>/g, "").length > 100 &&
                    "..."}
                </td>
                <td>
                  {item.url || item.imagen_url ? (
                    <img
                      src={`http://localhost:5000${
                        item.url || item.imagen_url
                      }`}
                      alt={item.titulo}
                      className="admin-nosotros-img"
                    />
                  ) : null}
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

      {/* Formulario (crear/editar) */}
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
