import React, { useContext } from "react";
import HeaderNav from "../navigation/HeaderNav";
import HeaderRightContent from "./HeaderRightContent";
import { Link } from "react-router-dom";
import { FarzaaContext } from "../../context/FarzaaContext";
import { TbUsersMinus } from "react-icons/tb";
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HeaderAdminNav from "../navigation/HeaderAdminNav";
import AuthService from "../../service/auth/AuthService";
import APIUtil from "../../core/system/APIUtil";
import UserRoleDisplay from "../user/UserRoleDisplay";

const HeaderSection2 = ({ session }) => {
  const { isHeaderFixed } = useContext(FarzaaContext);
  const navigate = useNavigate();

  const handleLogoutSubmit = (e) => {
    e.preventDefault();

    const authService = new AuthService();
    authService.logout()
      .then(() => {
        authService.clearToken();
        APIUtil.redirectIfNotAuthenticated(navigate);

        toast.success('Sesión cerrada correctamente.', { position: 'top-right' });
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        toast.error('Error al cerrar sesión. Por favor, inténtalo de nuevo.', { position: 'top-right' });
      });

  }
  return (
    <header className="fz-header-section fz-1-header-section inner-page-header">
      <div className="top-header">
        <div className="container">
          <div className="row gy-3 align-items-center">
            <div className="col-4 d-none d-md-block">
              <span className="mail-address">
                <Link to="mailto:info@webmail.com">
                  <i
                    className="fa-regular fa-envelope-open"
                    style={{ paddingRight: 5 }}
                  ></i>
                  wms-cakes@gmail.com
                </Link>
              </span>
            </div>

            <div className="col-md-4 col-6 col-xxs-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <UserRoleDisplay showFullInfo={true} />
              </div>
            </div>

            {session && (
              <div className="col-md-4 col-6 col-xxs-12">
                <div className="top-header-right-actions">
                  <Link to="account" onClick={handleLogoutSubmit}>
                    <TbUsersMinus /> Cerrar sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bottom-header to-be-fixed ${isHeaderFixed ? "fixed" : ""}`}
      >
        <div className="container">
          <div className="row g-0 align-items-center">
            <div className="col-lg-3 col-md-6 col-9">
              <div className="fz-logo-container">
                <Link to="/">
                </Link>
              </div>
            </div>

            <div className="col-6 header-nav-container d-lg-block d-none">
              {
                session ? (
                  <HeaderAdminNav position={"justify-content-center"} />
                ) : (
                  <h5 className="fz-footer-widget__title"></h5>
                )
              }
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection2;
