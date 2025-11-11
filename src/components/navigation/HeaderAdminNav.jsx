import React from "react";
import { Link } from "react-router-dom";
// Import opcional para ocultar CRM por rol:
import APIUtil from "../../core/system/APIUtil";

const HeaderAdminNav = ({ position, downArrow }) => {
  const canSeeCRM = APIUtil?.hasAnyRole
    ? APIUtil.hasAnyRole(["ADMINISTRADOR", "VENDEDOR", "GERENTE_MERCADEO"])
    : true;

  return (
    <nav className="fz-header-nav">
      <ul className={`align-items-center ${position}`}>
        {/* Recursos Humanos */}
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Recursos Humanos</span>{" "}
            <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
          </a>
          <ul className="fz-submenu">
            <li>
              <Link to="/providers" className="fz-nav-link fz-submenu-nav-link">
                Proveedores
              </Link>
            </li>
            <li>
              <Link to="/clients" className="fz-nav-link fz-submenu-nav-link">
                Clientes
              </Link>
            </li>
          </ul>
        </li>

        {/* Entradas y Salidas */}
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Entradas y Salidas</span>{" "}
            <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
          </a>
          <ul className="fz-submenu">
            <li><Link to="/products" className="fz-nav-link fz-submenu-nav-link">Productos</Link></li>
            <li><Link to="/purchases" className="fz-nav-link fz-submenu-nav-link">Compras</Link></li>
            <li><Link to="/reportPurchases" className="fz-nav-link fz-submenu-nav-link">Reporte de compras</Link></li>
            <li><Link to="/sales" className="fz-nav-link fz-submenu-nav-link">Ventas</Link></li>
            <li><Link to="/inventory" className="fz-nav-link fz-submenu-nav-link">Inventario</Link></li>
            <li><Link to="/movement" className="fz-nav-link fz-submenu-nav-link">Movimientos (Transacciones)</Link></li>
          </ul>
        </li>

        {/* Eventos */}
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Eventos</span>{" "}
            <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
          </a>
          <ul className="fz-submenu">
            <li><Link to="/discounts" className="fz-nav-link fz-submenu-nav-link">Descuentos</Link></li>
          </ul>
        </li>

        {/* CRM como pantalla aparte + pestaña consistente para reportes */}
        {canSeeCRM && (
          <>
            <li className="fz-nav-item">
              <Link to="/crm" className="fz-nav-link">
                <span>CRM</span>
                <i className="fa-regular fa-arrow-up-right-from-square" style={{ marginLeft: 6 }}></i>
              </Link>
            </li>

            <li className="fz-dropdown fz-nav-item">
              <a role="button" className="fz-nav-link">
                <span>Reportes</span>{" "}
                <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
              </a>
              <ul className="fz-submenu">
                <li>
                  <Link to="/crm/reports" className="fz-nav-link fz-submenu-nav-link">
                    Ventas y desempeno
                  </Link>
                </li>
              </ul>
            </li>
          </>
        )}

        {/* Administración */}
        <li className="fz-dropdown fz-nav-item">
          <a role="button" className="fz-nav-link">
            <span>Administración</span>{" "}
            <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
          </a>
          <ul className="fz-submenu">
            <li><Link to="/user" className="fz-nav-link fz-submenu-nav-link">Usuarios</Link></li>
            <li><Link to="/role" className="fz-nav-link fz-submenu-nav-link">Roles</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderAdminNav;
