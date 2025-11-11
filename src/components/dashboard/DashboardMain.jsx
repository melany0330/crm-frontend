import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../core/system/APIUtil';
import DashboardAdmin from './DashboardAdmin';
import DashboardVendedor from './DashboardVendedor';
import DashboardGerente from './DashboardGerente';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard Principal que muestra contenido diferente según el rol del usuario
 */
const DashboardMain = () => {
    const { user, isAuthenticated } = useAuth();

    console.log('🏠 DashboardMain - Usuario autenticado:', isAuthenticated);
    console.log('🏠 DashboardMain - Datos del usuario:', user);

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
        console.log('🏠 DashboardMain - Evaluando roles del usuario...');

        // ADMINISTRADOR (rol ID: 1)
        if (hasRole('ADMINISTRADOR')) {
            console.log('✅ DashboardMain - Mostrando dashboard de Administrador');
            return <DashboardAdmin />;
        }

        // VENDEDOR (rol ID: 2)
        if (hasRole('VENDEDOR')) {
            console.log('✅ DashboardMain - Mostrando dashboard de Vendedor');
            return <DashboardVendedor />;
        }

        // GERENTE_MERCADEO (rol ID: 3)
        if (hasRole('GERENTE_MERCADEO')) {
            console.log('✅ DashboardMain - Mostrando dashboard de Gerente de Mercadeo');
            return <DashboardGerente />;
        }

        // Si no tiene ningún rol reconocido
        console.log('⚠️ DashboardMain - Rol no reconocido, mostrando dashboard genérico');
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

    return (
        <>
            {renderDashboardByRole()}
        </>
    );
};

export default DashboardMain;