import { useState } from "react";
import "../assets/css/politicasModal.css"; // 👈 agregamos un css dedicado

const PoliticasModal = ({ triggerText, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={className}
      >
        {triggerText}
      </a>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Política de Tratamiento de Datos Personales</h2>
            <div className="modal-body">
              <p>
                En cumplimiento de lo dispuesto en la Ley 1581 de 2012 y el
                Decreto 1377 de 2013, por medio del presente documento autorizo
                de manera libre, previa, expresa, voluntaria e informada a LAGSI
                COLOMBIA, en calidad de responsable del tratamiento de mis datos
                personales, para que realice la recolección, almacenamiento,
                uso, análisis, circulación y supresión de mis datos personales,
                conforme a las siguientes condiciones:
              </p>

              <h3>Finalidad del tratamiento</h3>
              <ul>
                <li>
                  Realizar procesos de diagnóstico, asesoría y acompañamiento
                  financiero personalizados.
                </li>
                <li>
                  Brindar información relacionada con productos o servicios
                  financieros, educativos o patrimoniales que puedan ser de
                  interés.
                </li>
                <li>
                  Contactarme para agendar citas, realizar seguimiento y evaluar
                  la calidad del servicio prestado.
                </li>
                <li>
                  Cumplir obligaciones contractuales, legales o contables que
                  surjan del servicio prestado.
                </li>
                <li>
                  Compartir mi información con aliados estratégicos, siempre
                  dentro de los fines aquí establecidos y garantizando la
                  protección de mis datos.
                </li>
                <li>
                  Enviar contenido informativo, educativo o promocional por
                  medios físicos o digitales.
                </li>
              </ul>

              <h3>Derechos del titular de los datos</h3>
              <ul>
                <li>
                  Conocer, actualizar, rectificar y suprimir mis datos
                  personales.
                </li>
                <li>Solicitar prueba de esta autorización.</li>
                <li>
                  Ser informado sobre el uso que se ha dado a mis datos
                  personales.
                </li>
                <li>
                  Revocar la autorización cuando no se respeten los principios,
                  derechos y garantías constitucionales y legales.
                </li>
              </ul>

              <h3>Canales de contacto</h3>
              <p>
                Podré ejercer mis derechos mediante comunicación escrita a:
                <br />
                <b>LAGSI COLOMBIA – Consultores Financieros</b>
                <br />
                Correo electrónico:{" "}
                <a href="mailto:info@lagsi.com.co">info@lagsi.com.co</a>
                <br />
                Teléfono: (+57) 312 836 8582
              </p>
            </div>

            <button className="btn-close" onClick={() => setIsOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PoliticasModal;
