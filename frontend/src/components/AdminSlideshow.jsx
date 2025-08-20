// frontend/src/components/AdminSlideshow.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const AdminSlideshow = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slideshow");
      setImages(res.data);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      setMensaje("No se pudo cargar el slideshow.");
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
      setMensaje("⚠️ Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:5000/api/slideshow", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensaje("✅ Imagen subida con éxito.");
      setFile(null);
      setPreview(null);
      fetchImages();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setMensaje("❌ Error al subir la imagen.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/slideshow/${id}`);
      setMensaje("🗑️ Imagen eliminada.");
      fetchImages();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      setMensaje("❌ Error al eliminar la imagen.");
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

      {mensaje && <p>{mensaje}</p>}

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
