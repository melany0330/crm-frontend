import React, { useState } from 'react';

/**
 * Componente de documentación para el sistema de roles
 */
const RoleSystemDocs = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const codeExamples = {
        hookUsage: `import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
    const { 
        user, 
        isAuthenticated, 
        hasRole, 
        hasAnyRole, 
        isAdmin, 
        isVendedor 
    } = useAuth();

    if (!isAuthenticated) return <div>Please login</div>;

    return (
        <div>
            <h1>Welcome {user.username}!</h1>
            <p>Your role: {user.roleDisplayName}</p>
            
            {isAdmin() && <AdminPanel />}
            {isVendedor() && <SalesPanel />}
            {hasAnyRole(['ADMIN', 'GERENTE_MERCADEO']) && <ReportsPanel />}
        </div>
    );
};`,

        roleProtected: `import RoleProtectedComponent from '../components/auth/RoleProtectedComponent';

const AdminPage = () => {
    return (
        <div>
            <h1>Admin Page</h1>
            
            {/* Solo para Administradores */}
            <RoleProtectedComponent roles={['ADMINISTRADOR']}>
                <AdminSettings />
            </RoleProtectedComponent>
            
            {/* Para Vendedores o Administradores */}
            <RoleProtectedComponent 
                roles={['VENDEDOR', 'ADMINISTRADOR']}
                fallback={<div>Access Denied</div>}
            >
                <SalesModule />
            </RoleProtectedComponent>
            
            {/* Requiere TODOS los roles especificados */}
            <RoleProtectedComponent 
                roles={['ADMIN', 'SUPERVISOR']} 
                requireAll={true}
            >
                <SuperAdminPanel />
            </RoleProtectedComponent>
        </div>
    );
};`,

        apiUtil: `import APIUtil from '../core/system/APIUtil';

// Verificar autenticación
const isLoggedIn = APIUtil.validateSession();

// Obtener información del usuario
const currentUser = APIUtil.getCurrentUser();
const userName = APIUtil.getUserName();
const roleId = APIUtil.getUserRoleId();
const roleName = APIUtil.getUserRoleName();

// Verificar roles
const isAdmin = APIUtil.isAdmin();
const hasRole = APIUtil.hasRole('VENDEDOR');
const hasAnyRole = APIUtil.hasAnyRole(['ADMIN', 'SUPERVISOR']);
const hasAllRoles = APIUtil.hasAllRoles(['ADMIN', 'SUPERVISOR']);

// Verificar expiración del token
const isExpiring = APIUtil.isTokenExpiringSoon(5); // 5 minutos`,

        routeProtection: `import RequireRoles from '../routes/RequireRoles';

// En App.jsx
<Routes>
    {/* Ruta pública */}
    <Route path="/login" element={<Login />} />
    
    {/* Solo para administradores */}
    <Route 
        path="/admin" 
        element={
            <RequireRoles roles={['ADMINISTRADOR']}>
                <AdminPanel />
            </RequireRoles>
        } 
    />
    
    {/* Para múltiples roles */}
    <Route 
        path="/crm" 
        element={
            <RequireRoles roles={['ADMINISTRADOR', 'VENDEDOR', 'GERENTE_MERCADEO']}>
                <CRMLayout />
            </RequireRoles>
        } 
    />
</Routes>`
    };

    const tabs = [
        { id: 'overview', label: 'Visión General', icon: '📋' },
        { id: 'roles', label: 'Roles Disponibles', icon: '👥' },
        { id: 'usage', label: 'Uso del Hook', icon: '🎣' },
        { id: 'components', label: 'Componentes', icon: '🧩' },
        { id: 'routing', label: 'Protección de Rutas', icon: '🛡️' },
        { id: 'api', label: 'API Utils', icon: '⚙️' }
    ];

    return (
        <div className="role-docs">
            <div className="docs-header">
                <h1>📚 Documentación del Sistema de Roles</h1>
                <p>Guía completa para implementar y usar el sistema de roles y autenticación</p>
            </div>

            <div className="docs-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="docs-content">
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <h2>🎯 Visión General</h2>
                        <p>
                            El sistema de roles implementado proporciona una autenticación robusta y
                            control de acceso basado en roles (RBAC) para la aplicación.
                        </p>

                        <h3>✨ Características Principales</h3>
                        <ul>
                            <li>🔐 Decodificación automática de tokens JWT</li>
                            <li>👤 Gestión de usuarios y roles</li>
                            <li>🛡️ Protección de componentes y rutas</li>
                            <li>⚡ Hook personalizado para fácil uso</li>
                            <li>🔄 Verificación automática de expiración de tokens</li>
                            <li>🎨 Componentes UI para mostrar información de roles</li>
                        </ul>

                        <h3>🏗️ Arquitectura</h3>
                        <div className="architecture-diagram">
                            <div className="layer">
                                <h4>🎣 Presentation Layer</h4>
                                <p>useAuth Hook, RoleProtectedComponent, UserRoleDisplay</p>
                            </div>
                            <div className="layer">
                                <h4>🧠 Business Logic</h4>
                                <p>APIUtil, AuthService, Role Validation</p>
                            </div>
                            <div className="layer">
                                <h4>🗄️ Data Layer</h4>
                                <p>Token Model, JWTUtil, LocalStorage</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="tab-content">
                        <h2>👥 Roles Disponibles</h2>

                        <div className="roles-grid">
                            <div className="role-card admin">
                                <h3>🔥 ADMINISTRADOR</h3>
                                <p><strong>ID:</strong> 1</p>
                                <p><strong>Permisos:</strong> Acceso completo al sistema</p>
                                <ul>
                                    <li>Gestión de usuarios y roles</li>
                                    <li>Configuración del sistema</li>
                                    <li>Acceso a todos los módulos</li>
                                    <li>Respaldos y mantenimiento</li>
                                </ul>
                            </div>

                            <div className="role-card vendedor">
                                <h3>💰 VENDEDOR</h3>
                                <p><strong>ID:</strong> 2</p>
                                <p><strong>Permisos:</strong> Gestión de ventas y clientes</p>
                                <ul>
                                    <li>Procesar ventas</li>
                                    <li>Gestión de clientes</li>
                                    <li>Manejo de inventario básico</li>
                                    <li>Facturación</li>
                                </ul>
                            </div>

                            <div className="role-card gerente">
                                <h3>📊 GERENTE_MERCADEO</h3>
                                <p><strong>ID:</strong> 3</p>
                                <p><strong>Permisos:</strong> Marketing y análisis</p>
                                <ul>
                                    <li>Campañas de marketing</li>
                                    <li>Análisis de mercado</li>
                                    <li>Reportes avanzados</li>
                                    <li>CRM completo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'usage' && (
                    <div className="tab-content">
                        <h2>🎣 Uso del Hook useAuth</h2>
                        <p>El hook <code>useAuth</code> es la forma más fácil de trabajar con autenticación y roles:</p>

                        <pre className="code-block">
                            <code>{codeExamples.hookUsage}</code>
                        </pre>

                        <h3>📋 Propiedades Disponibles</h3>
                        <div className="properties-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Propiedad</th>
                                        <th>Tipo</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>user</code></td>
                                        <td>Object</td>
                                        <td>Información completa del usuario</td>
                                    </tr>
                                    <tr>
                                        <td><code>isAuthenticated</code></td>
                                        <td>Boolean</td>
                                        <td>Si el usuario está autenticado</td>
                                    </tr>
                                    <tr>
                                        <td><code>loading</code></td>
                                        <td>Boolean</td>
                                        <td>Estado de carga</td>
                                    </tr>
                                    <tr>
                                        <td><code>hasRole(role)</code></td>
                                        <td>Function</td>
                                        <td>Verifica si tiene un rol específico</td>
                                    </tr>
                                    <tr>
                                        <td><code>hasAnyRole(roles)</code></td>
                                        <td>Function</td>
                                        <td>Verifica si tiene alguno de los roles</td>
                                    </tr>
                                    <tr>
                                        <td><code>isAdmin()</code></td>
                                        <td>Function</td>
                                        <td>Verifica si es administrador</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'components' && (
                    <div className="tab-content">
                        <h2>🧩 Componentes de Protección</h2>

                        <h3>RoleProtectedComponent</h3>
                        <p>Protege contenido basado en roles del usuario:</p>

                        <pre className="code-block">
                            <code>{codeExamples.roleProtected}</code>
                        </pre>

                        <h3>🎛️ Props del RoleProtectedComponent</h3>
                        <div className="props-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Prop</th>
                                        <th>Tipo</th>
                                        <th>Default</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>roles</code></td>
                                        <td>Array</td>
                                        <td>[]</td>
                                        <td>Roles permitidos</td>
                                    </tr>
                                    <tr>
                                        <td><code>fallback</code></td>
                                        <td>Component</td>
                                        <td>null</td>
                                        <td>Componente si no tiene permisos</td>
                                    </tr>
                                    <tr>
                                        <td><code>requireAll</code></td>
                                        <td>Boolean</td>
                                        <td>false</td>
                                        <td>Si requiere todos los roles</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'routing' && (
                    <div className="tab-content">
                        <h2>🛡️ Protección de Rutas</h2>
                        <p>Usa <code>RequireRoles</code> para proteger rutas completas:</p>

                        <pre className="code-block">
                            <code>{codeExamples.routeProtection}</code>
                        </pre>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="tab-content">
                        <h2>⚙️ API Utils</h2>
                        <p>Funciones utilitarias para trabajar con autenticación:</p>

                        <pre className="code-block">
                            <code>{codeExamples.apiUtil}</code>
                        </pre>
                    </div>
                )}
            </div>

            <style jsx>{`
                .role-docs {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    font-family: 'Inter', -apple-system, sans-serif;
                }

                .docs-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px;
                }

                .docs-header h1 {
                    margin: 0 0 1rem 0;
                    font-size: 2.5rem;
                }

                .docs-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 1rem;
                }

                .tab {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: #f8f9fa;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .tab:hover {
                    background: #e9ecef;
                    transform: translateY(-1px);
                }

                .tab.active {
                    background: #007bff;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                }

                .tab-icon {
                    font-size: 1.2rem;
                }

                .docs-content {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    min-height: 500px;
                }

                .tab-content h2 {
                    color: #2c3e50;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #007bff;
                }

                .tab-content h3 {
                    color: #34495e;
                    margin: 2rem 0 1rem 0;
                }

                .roles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .role-card {
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 4px solid;
                    background: #f8f9fa;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .role-card.admin {
                    border-left-color: #ff6b35;
                }

                .role-card.vendedor {
                    border-left-color: #4ecdc4;
                }

                .role-card.gerente {
                    border-left-color: #45b7d1;
                }

                .role-card h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                }

                .role-card ul {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }

                .role-card li {
                    margin: 0.5rem 0;
                }

                .architecture-diagram {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin: 2rem 0;
                }

                .layer {
                    padding: 1.5rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }

                .layer h4 {
                    margin: 0 0 0.5rem 0;
                    color: #007bff;
                }

                .properties-table, .props-table {
                    width: 100%;
                    margin: 1.5rem 0;
                }

                .properties-table table, .props-table table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .properties-table th, .props-table th {
                    background: #007bff;
                    color: white;
                    padding: 1rem;
                    text-align: left;
                }

                .properties-table td, .props-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                }

                .properties-table tr:hover, .props-table tr:hover {
                    background: #f8f9fa;
                }

                code {
                    background: #f1f3f4;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                }

                .code-block {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 1rem 0;
                    border: 1px solid #4a5568;
                }

                .code-block code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 0.85rem;
                    line-height: 1.5;
                    white-space: pre;
                }

                @media (max-width: 768px) {
                    .role-docs {
                        padding: 1rem;
                    }
                    
                    .docs-header h1 {
                        font-size: 2rem;
                    }
                    
                    .tabs {
                        justify-content: center;
                    }
                    
                    .tab {
                        padding: 0.5rem 1rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default RoleSystemDocs;