import { useEffect, useState } from "react";

const AdminInicio = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Cargar datos desde backend
  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => {
        setTitulo(data.titulo || "");
        setDescripcion(data.descripcion || "");
        if (data.imagen_url) {
          setPreview(`http://localhost:5000${data.imagen_url}`);
        }
      })
      .catch((err) => {
        console.error("Error al cargar:", err);
        setMensaje("No se pudo cargar la información.");
      });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      if (file) {
        formData.append("imagen", file);
      }

      const res = await fetch("http://localhost:5000/api/inicio", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMensaje(result.message || "Actualización exitosa");
        if (result.imagen_url) {
          setPreview(`http://localhost:5000${result.imagen_url}`);
        }
      } else {
        setMensaje(result.error || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Editar Sección Inicio</h2>
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
            <strong>Descripción:</strong>
          </label>
          <br />
          <textarea
            rows={6}
            cols={80}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <label>
            <strong>Imagen de Fondo:</strong>
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
              style={{ width: "300px", border: "1px solid #ccc" }}
            />
          </div>
        )}

        <br />
        <button type="submit">Guardar Cambios</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AdminInicio;
