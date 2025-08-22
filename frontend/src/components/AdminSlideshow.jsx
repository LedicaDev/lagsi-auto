// frontend/src/components/AdminSlideshow.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminSlideshow = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slideshow");
      setImages(res.data);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      Swal.fire("Error", "No se pudo cargar el slideshow.", "error");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire("Atención", "⚠️ Selecciona una imagen primero.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:5000/api/slideshow", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Éxito", "✅ Imagen subida con éxito.", "success");
      setFile(null);
      setPreview(null);
      fetchImages();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Swal.fire("Error", "❌ Error al subir la imagen.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/slideshow/${id}`);
      Swal.fire("Eliminada", "🗑️ Imagen eliminada correctamente.", "success");
      fetchImages();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      Swal.fire("Error", "❌ Error al eliminar la imagen.", "error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Administrar Slideshow</h2>

      <form onSubmit={handleUpload} encType="multipart/form-data">
        <div>
          <label>
            <strong>Subir nueva imagen:</strong>
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
        <button type="submit">Guardar Imagen</button>
      </form>

      <hr />

      <h3>Imágenes actuales:</h3>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              margin: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={`http://localhost:5000${img.url}`}
              alt="slideshow"
              style={{ width: "200px", height: "auto" }}
            />
            <br />
            <button
              style={{ marginTop: "0.5rem" }}
              onClick={() => handleDelete(img.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlideshow;
