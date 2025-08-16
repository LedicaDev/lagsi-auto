const bcrypt = require("bcrypt");
const passwordPlano = "admin123"; // Asegúrate que sea la misma que usarás
const saltRounds = 10;

bcrypt.hash(passwordPlano, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error al encriptar:", err);
    return;
  }

  console.log("Nuevo hash:", hash);
});
