import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../core/system/APIUtil';
import DashboardAdmin from './DashboardAdmin';
import DashboardVendedor from './DashboardVendedor';
import DashboardGerente from './DashboardGerente';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';
import Layout from '../layout/Layout';
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection';

/**
 * Dashboard Principal que muestra contenido diferente según el rol del usuario
 */
const DashboardMain = () => {
    const { user, isAuthenticated } = useAuth();
    const [selectedDashboard, setSelectedDashboard] = useState('default');

    // Si no está autenticado, mostrar mensaje
    if (!isAuthenticated || !user) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                color: '#666'
            }}>
                <h2>⚠️ Acceso Requerido</h2>
                <p>Debes iniciar sesión para acceder al dashboard.</p>
            </div>
        );
    }

    // Renderizar dashboard según el rol
    const renderDashboardByRole = () => {

        // ADMINISTRADOR (rol ID: 1) - Puede ver todos los dashboards
        if (hasRole('ADMINISTRADOR')) {

            // Si el administrador seleccionó una vista específica
            if (selectedDashboard === 'vendedor') {
                return <DashboardVendedor />;
            } else if (selectedDashboard === 'gerente') {
                return <DashboardGerente />;
            }

            // Por defecto, mostrar dashboard de admin
            return <DashboardAdmin />;
        }

        // VENDEDOR (rol ID: 2)
        if (hasRole('VENDEDOR')) {
            return <DashboardVendedor />;
        }

        // GERENTE_MERCADEO (rol ID: 3)
        if (hasRole('GERENTE_MERCADEO')) {
            return <DashboardGerente />;
        }

        // Si no tiene ningún rol reconocido
        return (
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    color: '#8b4513',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1>🏠 Dashboard General</h1>
                        <p>Bienvenido al sistema CRM</p>
                    </div>
                    <UserRoleDisplay showFullInfo={true} />
                </div>

                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3>⚠️ Rol No Reconocido</h3>
                    <p>Tu rol actual no tiene un dashboard específico configurado.</p>
                    <p>Contacta al administrador del sistema para obtener los permisos apropiados.</p>

                    <div style={{
                        margin: '1rem 0',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <strong>Información de Debug:</strong><br />
                        Usuario: {user?.nombre || 'No disponible'}<br />
                        Roles: {JSON.stringify(user?.roles || [])}
                    </div>
                </div>
            </div>
        );
    };

    // Renderizar selector de vista para administradores
    const renderAdminViewSelector = () => {
        if (!hasRole('ADMINISTRADOR')) return null;

        return (
            <div style={{
                background: 'white',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <span style={{ fontWeight: '600', color: '#667eea' }}>👑 Vista de Administrador:</span>
                <select
                    value={selectedDashboard}
                    onChange={(e) => {
                        console.log('🔄 Cambiando vista a:', e.target.value);
                        setSelectedDashboard(e.target.value);
                    }}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '2px solid #667eea',
                        fontSize: '0.9rem'
                    }}
                >
                    <option value="default">🏠 Dashboard Administrador</option>
                    <option value="vendedor">💰 Vista de Vendedor</option>
                    <option value="gerente">📊 Vista de Gerente Marketing</option>
                </select>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    Los administradores pueden ver todas las vistas
                </span>
            </div>
        );
    };

    // Función para obtener el título según el rol
    const getBreadcrumbTitle = () => {
        if (hasRole('ADMINISTRADOR')) {
            if (selectedDashboard === 'vendedor') return 'Dashboard de Ventas';
            if (selectedDashboard === 'gerente') return 'Dashboard de Marketing';
            return 'Dashboard Administrativo';
        }
        if (hasRole('VENDEDOR')) return 'Dashboard de Ventas';
        if (hasRole('GERENTE_MERCADEO')) return 'Dashboard de Marketing';
        return 'Dashboard Principal';
    };

    return (
        <Layout login={true}>
            <BreadcrumbSection title={getBreadcrumbTitle()} current="Dashboard" />
            {renderAdminViewSelector()}
            {renderDashboardByRole()}
        </Layout>
    );
};

export default DashboardMain;