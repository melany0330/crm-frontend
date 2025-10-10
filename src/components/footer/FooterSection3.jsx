import React from "react";
import { Link } from "react-router-dom";

const FooterSection = ({ logo }) => {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "40px 0",
    fontFamily: "Arial, sans-serif",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    transition: "color 0.3s",
  };

  const linkHoverStyle = {
    color: "#f0a500",
  };

  const widgetTitleStyle = {
    color: "#fff",
    marginBottom: "15px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const textStyle = {
    color: "#ccc",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "15px",
  };

  const socialIconStyle = {
    fontSize: "18px",
    color: "#fff",
    marginRight: "10px",
  };

  const paymentImageStyle = {
    filter: "brightness(1.2)",
    maxWidth: "100%",
  };

  return (
    <footer style={footerStyle}>
      <div style={{ paddingBottom: "30px" }}>
        <div className="container">
          <div className="row gy-md-5 gy-4 justify-content-center justify-content-lg-between">
            <div className="col-xxl-4 col-lg-12 col-md-8">
              <div>
                <div style={widgetTitleStyle}>
                  <Link to="/" style={linkStyle}>
                    <img
                      src="assets/images/bakerylogo.png"
                      alt="Payment Methods"
                      style={paymentImageStyle}
                    />
                  </Link>
                </div>
<p style={textStyle}>
  Endulza tu día con nuestros pasteles y postres artesanales, elaborados con los
  mejores ingredientes y mucho cariño. Desde clásicos hasta creaciones únicas,
  tenemos algo delicioso para cada ocasión.
</p>
                <img
                  src="assets/images/card.png"
                  alt="Payment Methods"
                  style={paymentImageStyle}
                />
              </div>
            </div>

            <div className="col-xxl-2 col-lg-3 col-md-4 col-6 col-xxs-12">
            </div>



            <div className="col-xxl-2 col-lg-3 col-md-4 col-6 col-xxs-12">
              <div>
                <h5 style={widgetTitleStyle}>Contacto de la tienda</h5>
                <ul>
                  <li><Link to="#" style={linkStyle}><i className="fa-light fa-location-dot"></i> 5 calle 4-45, zona 1, Quetzaltenango Guatemala</Link></li>
                  <li><Link to="tel:9072254144" style={linkStyle}><i className="fa-light fa-phone"></i> (+502) 4534 - 3283</Link></li>
                  <li><Link to="mailto:info@webmail.com" style={linkStyle}><i className="fa-light fa-envelope-open-text"></i> wmscakes@gmail.com</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-md-6 col-12">
              <p style={{ color: "#ccc", fontSize: "14px" }}>
                &copy; {currentYear} Design & Developed by <b>Sebastian - Wilson - Melany</b>
              </p>
            </div>
            <div className="col-md-6 col-12">
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Link to="#" style={socialIconStyle}><i className="fa-brands fa-facebook-f"></i></Link>
                <Link to="#" style={socialIconStyle}><i className="fa-brands fa-twitter"></i></Link>
                <Link to="#" style={socialIconStyle}><i className="fa-brands fa-instagram"></i></Link>
                <Link to="#" style={socialIconStyle}><i className="fa-brands fa-youtube"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;