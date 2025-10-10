import React from 'react';
import { Link } from 'react-router-dom';

const TeamSection = () => {
  return (
    <div className="fz-team-member-section" style={{ background: "linear-gradient(to right, #f8c8dc, #ffe0b2)" }}>
      <div className="container">
        <h2 className="section-title">Nuestro Equipo</h2>

        <div className="row g-3 g-md-4 justify-content-center">
          <div className="col-lg-3 col-md-4 col-6 col-xxs-12">
            <div className="fz-single-team-member">
              <div className="fz-single-team-member__img">
                <img src="assets/images/mujer.jpg" alt="Person Picture"/>
              </div>

              <div className="fz-single-team-member__txt">
                <div className="fz-single-team-member__info">
                  <h5 className="fz-single-team-member__name">Melany Ambrocio</h5>
                  <span className="fz-single-team-member__label">COO</span>
                </div>

              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-6 col-xxs-12">
            <div className="fz-single-team-member">
              <div className="fz-single-team-member__img">
                <img src="assets/images/hombre.jpg" alt="Person Picture"/>
              </div>

              <div className="fz-single-team-member__txt">
                <div className="fz-single-team-member__info">
                  <h5 className="fz-single-team-member__name">Sebastian Rocop</h5>
                  <span className="fz-single-team-member__label">CEO</span>
                </div>

                <ul className="fz-single-team-member__socials">
                  <li><Link to="https://www.facebook.com/sebastian.rocop"><i className="fa-brands fa-facebook-f"></i></Link></li>
                  <li><Link to="https://www.instagram.com/sxbas_r7/?hl=es-la"><i className="fa-brands fa-instagram"></i></Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-6 col-xxs-12">
            <div className="fz-single-team-member">
              <div className="fz-single-team-member__img">
                <img src="assets/images/hombre.jpg" alt="Person Picture"/>
              </div>

              <div className="fz-single-team-member__txt">
                <div className="fz-single-team-member__info">
                  <h5 className="fz-single-team-member__name">Wilson Cabrera</h5>
                  <span className="fz-single-team-member__label">CTO</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamSection;