
import React from "react";
import { Link } from "react-router-dom";


const HeaderAdminNav = ({ position, downArrow }) => {
  return (
    <nav className="fz-header-nav">
      <ul className={`align-items-center ${position}`}>
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Recursos Humanos</span>{" "}
            <i
              className={
                downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"
              }
            ></i>
          </a>

          <ul className="fz-submenu">
            <li>
              <Link to="/providers" className="fz-nav-link fz-submenu-nav-link">
                Proveedores
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className="fz-nav-link fz-submenu-nav-link"
              >
                Clientes
              </Link>
            </li>
          </ul>
        </li>
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Entradas y Salidas</span>{" "}
            <i
              className={
                downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"
              }
            ></i>
          </a>

          <ul className="fz-submenu">
            <li>
              <Link to="/products" className="fz-nav-link fz-submenu-nav-link">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="fz-nav-link fz-submenu-nav-link">
                Compras
              </Link>
            </li>
            <li>
              <Link to="/reportPurchases" className="fz-nav-link fz-submenu-nav-link">
                Reporte de compras
              </Link>
            </li>
            <li>
              <Link
                to="/sales"
                className="fz-nav-link fz-submenu-nav-link"
              >
                Ventas
              </Link>
            </li>
            <li>
              <Link
                to="/inventory"
                className="fz-nav-link fz-submenu-nav-link"
              >
                Inventario
              </Link>
            </li>
            <li>
              <Link
                to="/movement"
                className="fz-nav-link fz-submenu-nav-link"
              >
                Movimientos (Transacciones)
              </Link>
            </li>
          </ul>
        </li>
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Eventos</span>{" "}
            <i
              className={
                downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"
              }
            ></i>
          </a>

          <ul className="fz-submenu">
            <li>
              <Link to="/discounts" className="fz-nav-link fz-submenu-nav-link">
                Descuentos
              </Link>
            </li>
          </ul>
        </li>
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Administración</span>{" "}
            <i
              className={
                downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"
              }
            ></i>
          </a>          
          <ul className="fz-submenu">
            <li>
              <Link to="/user" className="fz-nav-link fz-submenu-nav-link">
                Usuarios
              </Link>
            </li>
            <li>
              <Link to="/role" className="fz-nav-link fz-submenu-nav-link">
                Roles
              </Link>
            </li>
          </ul>
        </li>     
      </ul>
    </nav>
  );
};

export default HeaderAdminNav;