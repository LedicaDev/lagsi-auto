import React, { useEffect, useState } from "react";

export default function AdminNosotros() {
  const [secciones, setSecciones] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    imagen: null,
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  // 📌 Cargar datos al iniciar
  useEffect(() => {
    fetch("/api/nosotros")
      .then((res) => res.json())
      .then((data) => setSecciones(data))
      .catch((err) => console.error("Error al cargar Nosotros:", err));
  }, []);

  // 📌 Manejar cambios en campos
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setForm({ ...form, imagen: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 📌 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("descripcion", form.descripcion);
    if (form.imagen) {
      formData.append("imagen", form.imagen);
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `/api/nosotros/${editId}?section=nosotros`
      : `/api/nosotros?section=nosotros`;

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Registro guardado");
      // Recargar lista
      const updated = await fetch("/api/nosotros").then((res) => res.json());
      setSecciones(updated);
      setForm({ titulo: "", descripcion: "", imagen: null });
      setPreview(null);
      setEditId(null);
    } else {
      alert(data.error || "Error al guardar");
    }
  };

  // 📌 Editar registro
  const handleEdit = (item) => {
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      imagen: null, // No cargamos archivo aquí
    });
    setPreview(item.imagen ? item.imagen : null);
    setEditId(item.id);
  };

  // 📌 Eliminar registro
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta sección?")) return;
    const res = await fetch(`/api/nosotros/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setSecciones(secciones.filter((s) => s.id !== id));
    } else {
      alert(data.error || "Error al eliminar");
    }
  };

  return (
    <div className="admin-nosotros">
      <h2>Administrar Nosotros</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="form-nosotros">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        ></textarea>

        <input
          type="file"
          name="imagen"
          onChange={handleChange}
          accept="image/*"
        />

        {preview && (
          <div className="preview">
            <img src={preview} alt="Previsualización" width="120" />
          </div>
        )}

        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      {/* Lista de secciones */}
      <div className="lista-nosotros">
        {secciones.map((item) => (
          <div key={item.id} className="card-nosotros">
            <h3>{item.titulo}</h3>
            <p>{item.descripcion}</p>
            {item.imagen && (
              <img src={item.imagen} alt={item.titulo} width="120" />
            )}
            <div className="acciones">
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
