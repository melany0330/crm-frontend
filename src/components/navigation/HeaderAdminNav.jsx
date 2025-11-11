import React from "react";
import { Link } from "react-router-dom";
import APIUtil from "../../core/system/APIUtil";

const HeaderAdminNav = ({ position, downArrow }) => {
  // Permisos por rol
  const isAdmin = APIUtil.hasRole('ADMINISTRADOR');
  const isVendedor = APIUtil.hasRole('VENDEDOR');
  const isGerente = APIUtil.hasRole('GERENTE_MERCADEO');
  const canSeeClients = isVendedor || isAdmin;

  // PROVEEDORES: VENDEDOR + ADMINISTRADOR 
  const canSeeProviders = isVendedor || isAdmin;

  // PRODUCTOS: VENDEDOR + ADMINISTRADOR  
  const canSeeProducts = isVendedor || isAdmin;

  // VENTAS: VENDEDOR + ADMINISTRADOR
  const canSeeSales = isVendedor || isAdmin;

  // COMPRAS: VENDEDOR + ADMINISTRADOR 
  const canSeePurchases = isVendedor || isAdmin;

  // INVENTARIO: VENDEDOR + ADMINISTRADOR 
  const canSeeInventory = isVendedor || isAdmin;

  // MOVIMIENTOS: VENDEDOR + ADMINISTRADOR 
  const canSeeMovement = isVendedor || isAdmin;

  // DESCUENTOS: VENDEDOR + ADMINISTRADOR 
  const canSeeDiscounts = isVendedor || isAdmin;

  // USUARIOS Y ROLES: Solo ADMINISTRADOR
  const canSeeAdministracion = isAdmin;

  // CRM: ADMINISTRADOR + GERENTE_MERCADEO
  const canSeeCRM = isAdmin || isGerente;

  // Secciones del menú
  const canSeeRecursosHumanos = canSeeProviders || canSeeClients;
  const canSeeEntradasSalidas = canSeeProducts || canSeePurchases || canSeeSales || canSeeInventory || canSeeMovement;
  const canSeeEventos = canSeeDiscounts;

  return (
    <nav className="fz-header-nav">
      <ul className={`align-items-center ${position}`}>
        {/* Recursos Humanos - Visible para todos los roles */}
        {canSeeRecursosHumanos && (
          <li className="fz-dropdown fz-nav-item">
            <a role="button" className="fz-nav-link">
              <span>Recursos Humanos</span>{" "}
              <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
            </a>
            <ul className="fz-submenu">
              {canSeeProviders && (
                <li>
                  <Link to="/providers" className="fz-nav-link fz-submenu-nav-link">
                    Proveedores
                  </Link>
                </li>
              )}
              {canSeeClients && (
                <li>
                  <Link to="/clients" className="fz-nav-link fz-submenu-nav-link">
                    Clientes
                  </Link>
                </li>
              )}
            </ul>
          </li>
        )}

        {/* Entradas y Salidas - Admin y Vendedor */}
        {canSeeEntradasSalidas && (
          <li className="fz-dropdown fz-nav-item">
            <a role="button" className="fz-nav-link">
              <span>Entradas y Salidas</span>{" "}
              <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
            </a>
            <ul className="fz-submenu">
              {canSeeProducts && (
                <li><Link to="/products" className="fz-nav-link fz-submenu-nav-link">Productos</Link></li>
              )}
              {canSeePurchases && (
                <>
                  <li><Link to="/purchases" className="fz-nav-link fz-submenu-nav-link">Compras</Link></li>
                  <li><Link to="/reportPurchases" className="fz-nav-link fz-submenu-nav-link">Reporte de compras</Link></li>
                </>
              )}
              {canSeeSales && (
                <li><Link to="/sales" className="fz-nav-link fz-submenu-nav-link">Ventas</Link></li>
              )}
              {canSeeInventory && (
                <li><Link to="/inventory" className="fz-nav-link fz-submenu-nav-link">Inventario</Link></li>
              )}
              {canSeeMovement && (
                <li><Link to="/movement" className="fz-nav-link fz-submenu-nav-link">Movimientos (Transacciones)</Link></li>
              )}
            </ul>
          </li>
        )}

        {/* Eventos - Vendedor y Admin */}
        {canSeeEventos && (
          <li className="fz-dropdown fz-nav-item">
            <a role="button" className="fz-nav-link">
              <span>Eventos</span>{" "}
              <i className={downArrow ? "fa-solid fa-angle-down" : "fa-regular fa-plus"}></i>
            </a>
            <ul className="fz-submenu">
              <li><Link to="/discounts" className="fz-nav-link fz-submenu-nav-link">Descuentos</Link></li>
            </ul>
          </li>
        )}

        {/* CRM - Visible para todos los roles */}
        {canSeeCRM && (
          <li className="fz-nav-item">
            <Link to="/crm" className="fz-nav-link">
              <span>CRM</span>
              <i className="fa-regular fa-arrow-up-right-from-square" style={{ marginLeft: 6 }}></i>
            </Link>
          </li>
        )}

        {/* Administración - Solo Administrador */}
        {canSeeAdministracion && (
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
        )}
      </ul>
    </nav>
  );
};

export default HeaderAdminNav;
