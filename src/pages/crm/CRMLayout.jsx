import { NavLink, Outlet } from "react-router-dom";

export default function CRMLayout() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#fff" : "#222",
    background: isActive ? "#3b82f6" : "transparent",
    border: "1px solid #cbd5e1",
  });

  return (
    <div className="container" style={{ paddingTop: 12, paddingBottom: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Sí, Chef, CRM — Gestión Comercial</h2>

      <nav style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <NavLink to="/crm" end style={linkStyle}>Inicio</NavLink>
        <NavLink to="/crm/clients" style={linkStyle}>Clientes</NavLink>
        <NavLink to="/crm/opportunities" style={linkStyle}>Oportunidades</NavLink>
        <NavLink to="/crm/activities" style={linkStyle}>Actividades</NavLink>
        <NavLink to="/crm/campaigns" style={linkStyle}>Campañas</NavLink>
        <NavLink to="/crm/reports" style={linkStyle}>Reportes</NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
