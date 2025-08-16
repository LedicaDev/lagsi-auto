// ✅ TESTIMONIOS - videos embebidos
app.get("/api/testimonios", (req, res) => {
  db.query("SELECT * FROM testimonios ORDER BY orden ASC", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al cargar testimonios" });
    res.json(results);
  });
});

app.post("/api/testimonios", (req, res) => {
  const { titulo, url, orden } = req.body;
  if (!titulo || !url) {
    return res.status(400).json({ error: "Título y URL son requeridos" });
  }
  db.query(
    "INSERT INTO testimonios (titulo, url, orden) VALUES (?, ?, ?)",
    [titulo, url, orden || 0],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al agregar testimonio" });
      res.json({ message: "Testimonio agregado con éxito" });
    }
  );
});

app.put("/api/testimonios/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, url, orden } = req.body;
  db.query(
    "UPDATE testimonios SET titulo = ?, url = ?, orden = ? WHERE id = ?",
    [titulo, url, orden || 0, id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error al actualizar testimonio" });
      res.json({ message: "Testimonio actualizado" });
    }
  );
});

app.delete("/api/testimonios/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM testimonios WHERE id = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar testimonio" });
    res.json({ message: "Testimonio eliminado" });
  });
});
