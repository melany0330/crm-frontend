import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { hasRole, hasAnyRole } from '../../core/system/APIUtil';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Demostración interactiva del sistema de roles
 */
const RoleTestDemo = () => {
    const { user, isAuthenticated } = useAuth();
    const [selectedRole, setSelectedRole] = useState('VENDEDOR');

    // Simulación de diferentes tokens JWT para demostración
    const simulateLogin = (roleId) => {
        console.log(`🔄 Simulando login con rol ID: ${roleId}`);

        // Crear un payload simulado
        const mockPayload = {
            sub: "demo-user",
            nombre: `Usuario Demo ${roleId}`,
            email: "demo@ejemplo.com",
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
            iat: Math.floor(Date.now() / 1000),
            rol: roleId
        };

        // Simular el token (en producción esto vendría del servidor)
        const mockToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;

        // Guardar en localStorage
        localStorage.setItem('authToken', mockToken);

        // Recargar la página para que se actualice el contexto
        window.location.reload();
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        window.location.reload();
    };

    const roleButtons = [
        { id: 1, name: 'ADMINISTRADOR', color: '#667eea', icon: '👑' },
        { id: 2, name: 'VENDEDOR', color: '#4ecdc4', icon: '💰' },
        { id: 3, name: 'GERENTE_MERCADEO', color: '#f093fb', icon: '📊' }
    ];

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <h1>🔐 Demo del Sistema de Roles</h1>
                <p>Prueba diferentes roles y ve cómo cambia la interfaz</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Panel de Control */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '2px solid #e2e8f0'
                }}>
                    <h3>🎮 Panel de Control</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <h4>Simular Login con Diferentes Roles:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {roleButtons.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => simulateLogin(role.id)}
                                    style={{
                                        padding: '0.75rem',
                                        background: role.color,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {role.icon} Iniciar como {role.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        style={{
                            padding: '0.75rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            width: '100%'
                        }}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>

                {/* Estado Actual */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '2px solid #e2e8f0'
                }}>
                    <h3>📊 Estado Actual</h3>

                    {isAuthenticated ? (
                        <div>
                            <UserRoleDisplay showFullInfo={true} />

                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                            }}>
                                <strong>Información Técnica:</strong><br />
                                Autenticado: {isAuthenticated ? '✅ Sí' : '❌ No'}<br />
                                Usuario: {user?.nombre || 'No disponible'}<br />
                                Email: {user?.email || 'No disponible'}<br />
                                Roles: {JSON.stringify(user?.roles || [])}<br />
                                Rol Principal: {user?.rol || 'No disponible'}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666' }}>
                            <p>❌ No hay sesión activa</p>
                            <p>Usa los botones de la izquierda para simular un login</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pruebas de Permisos */}
            {isAuthenticated && (
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '2px solid #e2e8f0'
                }}>
                    <h3>🧪 Pruebas de Permisos</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
                            <h4>Verificaciones Individuales:</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                <li>Es Admin: {hasRole('ADMINISTRADOR') ? '✅' : '❌'}</li>
                                <li>Es Vendedor: {hasRole('VENDEDOR') ? '✅' : '❌'}</li>
                                <li>Es Gerente: {hasRole('GERENTE_MERCADEO') ? '✅' : '❌'}</li>
                            </ul>
                        </div>

                        <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                            <h4>Verificaciones Múltiples:</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                <li>Admin O Vendedor: {hasAnyRole(['ADMINISTRADOR', 'VENDEDOR']) ? '✅' : '❌'}</li>
                                <li>Vendedor O Gerente: {hasAnyRole(['VENDEDOR', 'GERENTE_MERCADEO']) ? '✅' : '❌'}</li>
                                <li>Cualquier Rol: {hasAnyRole(['ADMINISTRADOR', 'VENDEDOR', 'GERENTE_MERCADEO']) ? '✅' : '❌'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Instrucciones */}
            <div style={{
                background: '#fef3c7',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '2rem',
                border: '2px solid #f59e0b'
            }}>
                <h3>📖 Instrucciones</h3>
                <ol>
                    <li><strong>Probar Roles:</strong> Usa los botones para simular login con diferentes roles</li>
                    <li><strong>Ver Dashboard:</strong> Ve a <code>/dashboard</code> para ver el dashboard específico del rol</li>
                    <li><strong>Probar Rutas:</strong> Intenta acceder a diferentes secciones protegidas</li>
                    <li><strong>Debug Info:</strong> Revisa la consola del navegador para logs detallados</li>
                </ol>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                    <strong>🔗 Enlaces de Prueba:</strong><br />
                    <a href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>
                        📊 Dashboard
                    </a>
                    <a href="/admin/usuarios" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>
                        👥 Admin Usuarios
                    </a>
                    <a href="/admin/roles" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>
                        🛡️ Admin Roles
                    </a>
                    <a href="/ventas" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>
                        💰 Ventas
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RoleTestDemo;