import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDashboardData, useSystemAlerts } from '../../hooks/useDashboardData';
import { LoadingCard, ErrorCard, StatCard, AlertCard, StatsGrid, LastUpdated } from './DashboardComponents';
import { KPISummary } from './DashboardDetailStats';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard específico para Administradores
 */
const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hooks para datos del dashboard
  const { data: adminData, loading: dataLoading, error: dataError, lastUpdated, refresh } = useDashboardData('admin', true);
  const { alerts, loading: alertsLoading, error: alertsError, refresh: refreshAlerts } = useSystemAlerts(true);

  // Funciones de navegación
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1>👑 Dashboard de Administrador</h1>
          <p>Panel de control completo del sistema CRM</p>
        </div>
        <UserRoleDisplay showFullInfo={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Estadísticas del Sistema */}
        {dataLoading ? (
          <LoadingCard title="Cargando estadísticas del sistema..." />
        ) : dataError ? (
          <ErrorCard
            title="Error al cargar estadísticas"
            message={dataError}
            onRetry={refresh}
          />
        ) : (
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #667eea'
          }}>
            <h3>📈 Estadísticas del Sistema</h3>
            <StatsGrid columns={2}>
              <StatCard
                title="Ventas Totales"
                value={adminData?.sales?.totalVentas || 0}
                color="#667eea"
                icon="💰"
                format="currency"
              />
              <StatCard
                title="Órdenes"
                value={adminData?.sales?.totalOrdenes || 0}
                color="#667eea"
                icon="📋"
                format="number"
              />
              <StatCard
                title="Clientes"
                value={adminData?.clients?.totalClientes || 0}
                color="#667eea"
                icon="👥"
                format="number"
              />
              <StatCard
                title="Productos"
                value={adminData?.inventory?.totalProductos || 0}
                color="#667eea"
                icon="📦"
                format="number"
              />
            </StatsGrid>
          </div>
        )}

        {/* Administración del Sistema */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '3px solid #764ba2'
        }}>
          <h3>⚙️ Administración</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => navigateTo('/user')}
              style={{
                padding: '0.75rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#5a67d8'}
              onMouseOut={(e) => e.target.style.background = '#667eea'}
            >
              👥 Gestionar Usuarios
            </button>
            <button
              onClick={() => navigateTo('/role')}
              style={{
                padding: '0.75rem',
                background: '#764ba2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#6b46c1'}
              onMouseOut={(e) => e.target.style.background = '#764ba2'}
            >
              🛡️ Gestionar Roles
            </button>
            <button
              onClick={() => navigateTo('/crm/reports')}
              style={{
                padding: '0.75rem',
                background: '#5a4d7c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#4c1d95'}
              onMouseOut={(e) => e.target.style.background = '#5a4d7c'}
            >
              📊 Reportes Generales
            </button>
          </div>
        </div>

        {/* Todos los Módulos */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '3px solid #4a3d5f',
          gridColumn: 'span 2'
        }}>
          <h3>🎯 Todos los Módulos del Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div
              onClick={() => navigateTo('/sales')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>💰 Ventas</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Completa gestión de ventas</p>
            </div>
            <div
              onClick={() => navigateTo('/clients')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>👥 Clientes</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de clientes</p>
            </div>
            <div
              onClick={() => navigateTo('/inventory')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>📦 Inventario</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Control de inventario</p>
            </div>
            <div
              onClick={() => navigateTo('/providers')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>🏢 Proveedores</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de proveedores</p>
            </div>
            <div
              onClick={() => navigateTo('/purchases')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>🛒 Compras</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de compras</p>
            </div>
            <div
              onClick={() => navigateTo('/discounts')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>🎁 Descuentos</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Promociones y ofertas</p>
            </div>
            <div
              onClick={() => navigateTo('/shop')}
              style={{
                padding: '1rem',
                background: '#e8e6f7',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ddd6fe';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e8e6f7';
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>🛍️ E-commerce</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Todas las tiendas</p>
            </div>
          </div>
        </div>

        {/* Alertas del Sistema */}
        <div style={{ gridColumn: 'span 2' }}>
          <AlertCard
            alerts={alerts}
            loading={alertsLoading}
            onRefresh={refreshAlerts}
          />
        </div>
      </div>

      {/* Indicador de última actualización */}
      <LastUpdated timestamp={lastUpdated} onRefresh={refresh} />
    </div>
  );
};

export default DashboardAdmin;
