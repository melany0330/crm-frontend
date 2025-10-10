import React from "react";

const StorySection = () => {
  return (
    <div className="fz-about-area" style={{ background: "linear-gradient(to right, #f8c8dc, #ffe0b2)", padding: "80px 0", borderRadius: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
      <div className="container">
        <div className="row gy-5 align-items-center">
          {/* Imágenes destacadas */}
          <div className="col-xl-6">
            <div className="fz-about-images">
              <div className="row g-0">
                <div className="col-sm-8 col-6">
                  <div className="fz-about-images-left position-relative">
                    <div className="fz-about-images-left-img" style={{ overflow: "hidden", borderRadius: "20px" }}>
                      <img
                        src="assets/images/lugar.jpg"
                        alt="Pasteles artesanales"
                        style={{ width: "100%", transition: "transform 0.5s ease", cursor: "pointer" }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>

                  </div>
                </div>

                <div className="col-sm-4 col-6 align-self-end align-self-xxs-start">
                  <div className="fz-about-images-right position-relative">
                    <div className="fz-about-images-right-img" style={{ overflow: "hidden", borderRadius: "20px" }}>
                      <img
                        src="assets/images/lugar4.jpg"
                        alt="Nuestra pastelería"
                        style={{ width: "100%", transition: "transform 0.5s ease", cursor: "pointer" }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>

                    <div className="fz-about-images-right__card" style={{
                      position: "absolute",
                      bottom: "-20px",
                      right: "-10px",
                      backgroundColor: "#5c2a3d",
                      padding: "10px 20px",
                      borderRadius: "15px",
                      color: "#fff",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                    }}>
                      <span style={{ fontSize: "0.8rem" }}>Desde</span>
                      <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "700" }}>2010</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido textual */}
          <div className="col-xl-6">
            <div className="fz-about-right-content">
              <h4 className="fz-about-right-title" style={{ fontSize: "2rem", color: "#5c2a3d", marginBottom: "20px" }}>Nuestra Historia</h4>
              <p className="fz-about-right-descr" style={{ fontSize: "1rem", lineHeight: "1.8", color: "#7a4e4e" }}>
                En Quetzaltenango, desde 2010, endulzamos cada momento con pasteles artesanales y postres únicos. Cada creación es elaborada con pasión, ingredientes locales y un toque de amor que hace que cada bocado sea inolvidable.
              </p>

              <div className="row mt-4">
                <div className="col-xl-5 col-md-4 col-sm-5 col-7 col-xxs-12">
                  <div className="fz-about-right-img" style={{ overflow: "hidden", borderRadius: "15px" }}>
                    <img src="assets/images/ricos.webp" alt="Pastel en Quetzaltenango" style={{ width: "100%", transition: "transform 0.5s ease" }} />
                  </div>
                </div>
                <div className="col-sm-7 col-md-8 col-xl-7">
                  <div className="fz-about-right-list">
                    <ul style={{ paddingLeft: "20px", color: "#7a4e4e" }}>
                      <li>Pedidos personalizados y rápidos</li>
                      <li>Entrega a domicilio o retiro en tienda</li>
                      <li>Pastelería artesanal de temporada</li>
                      <li>Amor y creatividad en cada detalle</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Autor / Pastelero */}
              <div className="fz-about-author mt-5 d-flex align-items-center">
                <span className="fz-about-author-sign-img">
                  <img src="assets/images/about-author-sign.png" alt="Firma del chef" style={{ height: "40px", marginRight: "15px" }} />
                </span>

                <div className="fz-about-author-intro d-flex align-items-center">
                  <span className="fz-about-author-img" style={{ marginRight: "10px" }}>
                    <img src="assets/images/pastelera.jpg" alt="Pastelero" style={{ width: "60px", borderRadius: "50%" }} />
                  </span>
                  <div className="fz-about-author-intro__txt">
                    <h5 className="fz-about-author-name" style={{ margin: 0, fontWeight: "700", color: "#5c2a3d" }}>Constanza Cifuentes</h5>
                    <span className="fz-about-author-label" style={{ fontSize: "0.8rem", color: "#7a4e4e" }}>Chef Pastelera</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySection;