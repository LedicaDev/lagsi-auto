import "../assets/css/contacto.css";
import Swal from "sweetalert2";
import PoliticasModal from "./PoliticasModal"; // 👈 Modal de políticas

const Contacto = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Validar aceptación de políticas
    if (!event.target.politicas.checked) {
      Swal.fire({
        icon: "warning",
        title: "Acepta las políticas",
        text: "Debes aceptar la política de tratamiento de datos para continuar.",
      });
      return;
    }

    try {
      const response = await fetch(event.target.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        Swal.fire({
          title: "Muchas Gracias",
          text: "¡Su mensaje ha sido enviado satisfactoriamente!",
          icon: "success",
        });
        event.target.reset();
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "¡Hubo un error al enviar el mensaje. Por favor, intenta de nuevo más tarde!",
        timer: 3000,
      });
    }
  };

  return (
    <>
      <article className="contacto section" id="contacto">
        <div className="contact-title">
          <h2>Contacto</h2>
        </div>
        <div className="contact-box">
          <div className="contact-box-map">
            <div className="contact-box-map-title">
              <span>Mi ubicación</span>
            </div>
            <iframe
              className="contact-box-map-google"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3974.1808847317816!2d-75.52749788877249!3d5.074412694881144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e476fe255075b1d%3A0xc9f13ccd03b5f727!2sCra.%2012%20%2311-44%2C%20Manizales%2C%20Caldas!5e0!3m2!1ses-419!2sco!4v1712794715025!5m2!1ses-419!2sco"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="contact-box-form">
            <div className="contact-form-title">
              <span>
                Escríbenos &nbsp;<i className="bx bx-edit"></i>
              </span>
            </div>
            <form
              className="contact-form"
              action="https://formsubmit.co/gerencia@lagsi.com.co"
              method="POST"
              onSubmit={handleSubmit}
            >
              <label className="tag-company" htmlFor="">
                Empresa
                <input
                  className="input-company"
                  type="text"
                  placeholder="Escribe el nombre de tu empresa"
                  name="Empresa"
                />
              </label>
              <label className="tag-company" htmlFor="">
                Nombre y apellidos *
                <input
                  className="input-company"
                  name="Nombre completo"
                  type="text"
                  placeholder="Escribe tu nombre completo"
                  required
                />
              </label>
              <label className="tag-company" htmlFor="">
                Email *
                <input
                  className="input-company"
                  name="Email"
                  type="text"
                  placeholder="Escribe tu correo electrónico"
                  required
                />
              </label>
              <label className="tag-company" htmlFor="">
                Número de contacto *
                <input
                  className="input-company"
                  name="Telefono"
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Escribe tu número de contacto - Formato: Solo números hasta 10 dígitos"
                  required
                />
              </label>
              <label className="tag-company" htmlFor="">
                Mensaje *
                <textarea
                  className="input-company input-textarea"
                  rows={10}
                  type="text"
                  name="Mensaje"
                  placeholder="Escribe tu mensaje"
                  required
                />
              </label>

              {/* ✅ Checkbox de aceptación con modal */}
              <div className="checkbox-politicas">
                <label>
                  <input type="checkbox" name="politicas" required /> Acepto{" "}
                  <PoliticasModal
                    triggerText="Política de tratamiento de datos personales Ley 1581 de 2012 y el Decreto 1377 de 2013"
                    className="contact-links-item"
                  />
                </label>
              </div>

              {/* Campo oculto para que quede registrado en el correo */}
              <input
                type="hidden"
                name="Aceptación de políticas"
                value="Sí, acepto la política de tratamiento de datos personales"
              />

              <div className="btn-send-content">
                <button className="btn-form" type="submit">
                  Enviar mensaje
                </button>
                <input
                  type="hidden"
                  name="_blacklist"
                  value="spammy pattern, banned term, phrase"
                />
                <input type="hidden" name="_captcha" value="false" />
              </div>
            </form>
          </div>
        </div>
      </article>
    </>
  );
};

export default Contacto;
