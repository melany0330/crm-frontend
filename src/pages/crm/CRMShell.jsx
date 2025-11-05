import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./crm.css";

export default function CRMShell() {
  return (
    <div className="crm-root">
      {/* Topbar */}
      <header className="crm-topbar">
        <div className="crm-topbar-left">
          <img src="/assets/images/logo-1.png" alt="Sí, Chef, CRM" className="crm-logo" />
          <div className="crm-brand">
            <span className="crm-brand-title">Sí, Chef, CRM</span>
            <span className="crm-brand-subtitle">Gestión Comercial</span>
          </div>
        </div>
        <div className="crm-topbar-right">
          <span className="crm-user">Hola, usuario</span>
        </div>
      </header>

      <div className="crm-body">
        {/* Sidebar */}
        <aside className="crm-sidebar">
          <nav className="crm-nav">
            <NavLink end to="/crm" className="crm-nav-link">
              <i className="fa-solid fa-gauge-high" /> <span>Panel</span>
            </NavLink>
            <NavLink to="/crm/clients" className="crm-nav-link">
              <i className="fa-regular fa-id-card" /> <span>Clientes</span>
            </NavLink>
            <NavLink to="/crm/opportunities" className="crm-nav-link">
              <i className="fa-regular fa-lightbulb" /> <span>Oportunidades</span>
            </NavLink>
            <NavLink to="/crm/activities" className="crm-nav-link">
              <i className="fa-regular fa-calendar-check" /> <span>Actividades</span>
            </NavLink>
            <NavLink to="/crm/campaigns" className="crm-nav-link">
              <i className="fa-solid fa-bullhorn" /> <span>Campañas</span>
            </NavLink>
            <NavLink to="/crm/reports" className="crm-nav-link">
              <i className="fa-regular fa-chart-bar" /> <span>Reportes</span>
            </NavLink>
          </nav>

          <div className="crm-sidebar-note">
            <p>Universidad Mesoamericana</p>
            <p className="crm-small">Programa Comercial – Octavo “E”</p>
          </div>
        </aside>

        {/* Content */}
        <main className="crm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
