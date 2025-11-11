import { NavLink, Outlet } from "react-router-dom";
import Layout from "../../components/layout/Layout";

export default function CRMLayout() {
  const linkStyle = ({ isActive }) => ({
    padding: "12px 18px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#fff" : "#333",
    background: isActive ? "#667eea" : "#f8f9fa",
    border: "1px solid #e9ecef",
    fontWeight: isActive ? "600" : "400",
    transition: "all 0.3s ease",
    display: "inline-block",
    marginBottom: "8px"
  });

  const CRMContent = () => (
    <div className="fz-inner-page-content" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header del CRM */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '700' }}>
            📊 Sistema CRM
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
            Gestión Comercial y Relación con Clientes
          </p>
        </div>

        {/* Navegación del CRM */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
            🧭 Navegación CRM
          </h3>
          <nav style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <NavLink to="/crm" end style={linkStyle}>
              🏠 Inicio
            </NavLink>
            <NavLink to="/crm/clients" style={linkStyle}>
              👥 Clientes
            </NavLink>
            <NavLink to="/crm/opportunities" style={linkStyle}>
              🎯 Oportunidades
            </NavLink>
            <NavLink to="/crm/activities" style={linkStyle}>
              📋 Actividades
            </NavLink>
            <NavLink to="/crm/campaigns" style={linkStyle}>
              📱 Campañas
            </NavLink>
            <NavLink to="/crm/reports" style={linkStyle}>
              📊 Reportes
            </NavLink>
          </nav>
        </div>

        {/* Contenido del CRM */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
          minHeight: '400px'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );

  return (
    <Layout login={true}>
      <CRMContent />
    </Layout>
  );
}
