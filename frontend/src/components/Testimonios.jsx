import React from "react";
import "../assets/css/testimonios.css";

const Testimonios = ({ testimonios = [] }) => {
  if (!testimonios.length) {
    return null;
  }

  return (
    <div className="testimonios-section section" id="testimonios">
      <div className="slide-title">
        <h2>Videos testimoniales</h2>
      </div>
      <div className="testimonios-container">
        {testimonios.map((video) => (
          <div className="testimonio-card" key={video.id}>
            <div className="testimonio-title">
              <h3>{video.titulo}</h3>
            </div>
            <div className="testimonio-video">
              <iframe
                src={video.url}
                title={video.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonios;
