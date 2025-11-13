import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import RoleProtectedComponent from '../auth/RoleProtectedComponent';
import UserRoleDisplay from '../user/UserRoleDisplay';

/**
 * Panel de administración que muestra diferentes opciones según el rol
 */
const AdminDashboard = () => {
    const {
        user,
        isAdmin,
        isVendedor,
        isGerenteMercadeo,
        hasAnyRole,
        userRole
    } = useAuth();

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Panel de Administración</h2>
                <UserRoleDisplay showFullInfo={true} />
            </div>

            <div className="dashboard-content">
                <div className="row">
                    {/* Sección solo para Administradores */}
                    <RoleProtectedComponent
                        roles={['ADMINISTRADOR']}
                        fallback={
                            <div className="col-md-4">
                                <div className="admin-card disabled">
                                    <h4>🔒 Gestión de Sistema</h4>
                                    <p>Solo disponible para Administradores</p>
                                </div>
                            </div>
                        }
                    >
                        <div className="col-md-4">
                            <div className="admin-card admin">
                                <h4>🛠️ Gestión de Sistema</h4>
                                <ul>
                                    <li>Gestión de Usuarios</li>
                                    <li>Gestión de Roles</li>
                                    <li>Configuración General</li>
                                    <li>Respaldos del Sistema</li>
                                </ul>
                                <button className="btn-admin">Acceder</button>
                            </div>
                        </div>
                    </RoleProtectedComponent>

                    {/* Sección para Vendedores y Administradores */}
                    <RoleProtectedComponent
                        roles={['VENDEDOR', 'ADMINISTRADOR']}
                        fallback={
                            <div className="col-md-4">
                                <div className="admin-card disabled">
                                    <h4>🔒 Gestión de Ventas</h4>
                                    <p>Solo disponible para Vendedores y Administradores</p>
                                </div>
                            </div>
                        }
                    >
                        <div className="col-md-4">
                            <div className="admin-card vendedor">
                                <h4>💰 Gestión de Ventas</h4>
                                <ul>
                                    <li>Procesar Ventas</li>
                                    <li>Gestión de Clientes</li>
                                    <li>Facturación</li>
                                    <li>Inventario</li>
                                </ul>
                                <button className="btn-vendedor">Acceder</button>
                            </div>
                        </div>
                    </RoleProtectedComponent>

                    {/* Sección para Gerentes de Mercadeo y Administradores */}
                    <RoleProtectedComponent
                        roles={['GERENTE_MERCADEO', 'ADMINISTRADOR']}
                        fallback={
                            <div className="col-md-4">
                                <div className="admin-card disabled">
                                    <h4>🔒 Gestión de Mercadeo</h4>
                                    <p>Solo disponible para Gerentes de Mercadeo y Administradores</p>
                                </div>
                            </div>
                        }
                    >
                        <div className="col-md-4">
                            <div className="admin-card gerente">
                                <h4>📊 Gestión de Mercadeo</h4>
                                <ul>
                                    <li>Campañas de Marketing</li>
                                    <li>Análisis de Mercado</li>
                                    <li>Reportes de Ventas</li>
                                    <li>CRM Avanzado</li>
                                </ul>
                                <button className="btn-gerente">Acceder</button>
                            </div>
                        </div>
                    </RoleProtectedComponent>
                </div>

                {/* Información del usuario actual */}
                <div className="user-info-section">
                    <h3>Información de tu cuenta</h3>
                    <div className="user-details">
                        <p><strong>Usuario:</strong> {user?.username}</p>
                        <p><strong>Rol:</strong> {user?.roleDisplayName || user?.roleName}</p>
                        <p><strong>ID:</strong> {user?.id}</p>
                        <p><strong>Permisos:</strong></p>
                        <ul className="permissions-list">
                            {isAdmin() && <li className="permission admin">✅ Administrador - Acceso completo</li>}
                            {isVendedor() && <li className="permission vendedor">✅ Vendedor - Gestión de ventas</li>}
                            {isGerenteMercadeo() && <li className="permission gerente">✅ Gerente Mercadeo - Análisis y campañas</li>}
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    padding: 2rem;
                    background: #f8f9fa;
                    min-height: 100vh;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    margin-bottom: 1rem;
                    border-left: 4px solid #ddd;
                    transition: transform 0.2s ease;
                }

                .admin-card:hover {
                    transform: translateY(-2px);
                }

                .admin-card.admin {
                    border-left-color: #ff6b35;
                }

                .admin-card.vendedor {
                    border-left-color: #4ecdc4;
                }

                .admin-card.gerente {
                    border-left-color: #45b7d1;
                }

                .admin-card.disabled {
                    opacity: 0.6;
                    background: #f5f5f5;
                    border-left-color: #ccc;
                }

                .admin-card h4 {
                    margin-bottom: 1rem;
                    color: #333;
                }

                .admin-card ul {
                    list-style: none;
                    padding: 0;
                    margin: 1rem 0;
                }

                .admin-card li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #eee;
                }

                .admin-card li:last-child {
                    border-bottom: none;
                }

                .btn-admin, .btn-vendedor, .btn-gerente {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-admin {
                    background: #ff6b35;
                    color: white;
                }

                .btn-vendedor {
                    background: #4ecdc4;
                    color: white;
                }

                .btn-gerente {
                    background: #45b7d1;
                    color: white;
                }

                .btn-admin:hover, .btn-vendedor:hover, .btn-gerente:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .user-info-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .permissions-list {
                    list-style: none;
                    padding: 0;
                }

                .permission {
                    padding: 0.5rem;
                    margin: 0.25rem 0;
                    border-radius: 6px;
                    font-weight: 500;
                }

                .permission.admin {
                    background: rgba(255, 107, 53, 0.1);
                    color: #ff6b35;
                }

                .permission.vendedor {
                    background: rgba(78, 205, 196, 0.1);
                    color: #4ecdc4;
                }

                .permission.gerente {
                    background: rgba(69, 183, 209, 0.1);
                    color: #45b7d1;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;