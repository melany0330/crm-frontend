import React from 'react';
import { Link } from 'react-router-dom';

const StoreSection = () => {
  const paragraphStyle = {
    fontSize: "1.15rem",
    color: "#5c2a3d",
    lineHeight: "1.8",
    marginBottom: "1rem",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    textAlign: "justify", // Justificado
  };

  const highlightStyle = {
    fontWeight: "700",
    color: "#a14d5a",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #f06292, #ffb74d)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "1rem",
  };

  return (
    <div className="fz-about-store-area" style={{ background: "linear-gradient(to right, #f8c8dc, #ffe0b2)" }}>
      <div className="container">
        
        {/* Misión */}
        <div className="fz-about-single-store">
          <div className="row gy-3 gy-sm-4 align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="fz-about-store-img">
                <img src="assets/images/mision.jpg" alt="Imagen de misión"/>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6">
              <div className="fz-about-store-content">
                <h4 className="fz-about-store-title" style={titleStyle}>Nuestra Misión</h4>
                <p style={paragraphStyle}>
                  Endulzar la vida de nuestros clientes en <span style={highlightStyle}>Quetzaltenango</span> con 
                  <span style={highlightStyle}> pasteles, donas, cupcakes y</span> de la más alta calidad, preparados con 
                  <span style={highlightStyle}> amor y creatividad</span>.
                </p>

                <div className="fz-about-right-list">
                  <ul>
                    <li>Productos frescos y de alta calidad</li>
                    <li>Atención personalizada y cercana</li>
                    <li>Compromiso con la satisfacción del cliente</li>
                  </ul>
                </div>

                <Link to="/shopProducts" className="fz-1-banner-btn fz-about-store-btn">Catalogo</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Visión */}
        <div className="fz-about-single-store">
          <div className="row gy-3 gy-sm-4 align-items-center">
            <div className="col-xl-6 col-lg-6 order-1 order-lg-0">
              <div className="fz-about-store-content">
                <h4 className="fz-about-store-title" style={titleStyle}>Nuestra Visión</h4>
                <p style={paragraphStyle}>
                  Ser la pastelería <span style={highlightStyle}>referente</span> en Quetzaltenango, reconocida por nuestra 
                  <span style={highlightStyle}> pasión, creatividad y calidad</span> en cada dulce creación.
                </p>

                <div className="fz-about-right-list">
                  <ul>
                    <li>Innovación constante en nuestros productos</li>
                    <li>Expansión y presencia en toda la ciudad</li>
                    <li>Fomentar la cultura del buen postre artesanal</li>
                  </ul>
                </div>

                <Link to="/cakes" className="fz-1-banner-btn fz-about-store-btn">Pasteles</Link>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 order-0 order-lg-1">
              <div className="fz-about-store-img">
                <img src="assets/images/xela.webp" alt="Imagen de visión"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSection;