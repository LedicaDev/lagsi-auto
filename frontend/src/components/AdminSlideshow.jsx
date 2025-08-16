// frontend/src/components/AdminSlideshow.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSlideshow = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slideshow");
      setImages(res.data);
    } catch (error) {
      console.error("Error al cargar imágenes", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona una imagen");

    const formData = new FormData();
    formData.append("image", file);

    try {
      // ✅ Le agregamos el parámetro section=slideshow
      await axios.post(
        "http://localhost:5000/api/slideshow?section=slideshow",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Imagen subida con éxito");
      setFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error al subir la imagen", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/slideshow/${id}`);
      alert("Imagen eliminada");
      fetchImages();
    } catch (error) {
      console.error("Error al eliminar imagen", error);
    }
  };

  return (
    <div>
      <h2>Administrar Slideshow</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>

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
            <button onClick={() => handleDelete(img.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlideshow;
