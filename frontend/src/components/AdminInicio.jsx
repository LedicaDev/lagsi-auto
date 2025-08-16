import { useEffect, useState } from "react";

const AdminInicio = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Cargar datos actuales desde backend
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => {
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
      })
      .catch((err) => {
        console.error("Error al cargar:", err);
        setMensaje("No se pudo cargar el descripcion.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/inicio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, description: descripcion }),
      });

      const result = await res.json();
      if (res.ok) {
        setMensaje(result.message || "Actualización exitosa");
      } else {
        setMensaje(result.error || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Ocurrió un error al conectar con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Editar descripcion de la Sección Inicio</h2>
      <form onSubmit={handleSubmit}>
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
        <br />
        <button type="submit">Guardar Cambios</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AdminInicio;
