import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Demostración simple del sistema de roles
 */
const SimpleRoleDemo = () => {
    const {
        user,
        isAuthenticated,
        loading,
        isAdmin,
        isVendedor,
        isGerenteMercadeo,
        hasAnyRole,
        userRole
    } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>🔄 Cargando información del usuario...</h2>
        </div>;
    }

    if (!isAuthenticated) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>❌ No autenticado</h2>
            <p>Por favor, inicia sesión para ver la demostración de roles.</p>
        </div>;
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <h1>🎭 Demostración del Sistema de Roles</h1>
                <UserRoleDisplay showFullInfo={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Información del Usuario */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #007bff'
                }}>
                    <h3>👤 Información del Usuario</h3>
                    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                        <p><strong>Usuario:</strong> {user?.username || 'N/A'}</p>
                        <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
                        <p><strong>Rol ID:</strong> {user?.roleId || 'N/A'}</p>
                        <p><strong>Rol:</strong> {user?.roleDisplayName || user?.roleName || 'N/A'}</p>
                        <p><strong>Token válido:</strong> {user?.isValid ? '✅ Sí' : '❌ No'}</p>
                        <p><strong>Expirando pronto:</strong> {user?.isExpiringSoon ? '⚠️ Sí' : '✅ No'}</p>
                    </div>
                </div>

                {/* Verificaciones de Roles */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #28a745'
                }}>
                    <h3>🔍 Verificaciones de Roles</h3>
                    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                        <p>
                            <strong>¿Es Administrador?</strong>
                            <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: isAdmin() ? '#d4edda' : '#f8d7da', color: isAdmin() ? '#155724' : '#721c24' }}>
                                {isAdmin() ? '✅ SÍ' : '❌ NO'}
                            </span>
                        </p>
                        <p>
                            <strong>¿Es Vendedor?</strong>
                            <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: isVendedor() ? '#d4edda' : '#f8d7da', color: isVendedor() ? '#155724' : '#721c24' }}>
                                {isVendedor() ? '✅ SÍ' : '❌ NO'}
                            </span>
                        </p>
                        <p>
                            <strong>¿Es Gerente Mercadeo?</strong>
                            <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: isGerenteMercadeo() ? '#d4edda' : '#f8d7da', color: isGerenteMercadeo() ? '#155724' : '#721c24' }}>
                                {isGerenteMercadeo() ? '✅ SÍ' : '❌ NO'}
                            </span>
                        </p>
                        <p>
                            <strong>¿Tiene permisos de Admin o Vendedor?</strong>
                            <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: hasAnyRole(['ADMINISTRADOR', 'VENDEDOR']) ? '#d4edda' : '#f8d7da', color: hasAnyRole(['ADMINISTRADOR', 'VENDEDOR']) ? '#155724' : '#721c24' }}>
                                {hasAnyRole(['ADMINISTRADOR', 'VENDEDOR']) ? '✅ SÍ' : '❌ NO'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Contenido Condicional */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #ffc107',
                    gridColumn: 'span 2'
                }}>
                    <h3>🎯 Contenido Basado en Roles</h3>

                    {isAdmin() && (
                        <div style={{
                            background: 'rgba(255, 107, 53, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: '0.5rem 0',
                            border: '2px solid #ff6b35'
                        }}>
                            <h4>🔥 Panel de Administrador</h4>
                            <p>¡Tienes acceso completo al sistema!</p>
                            <ul>
                                <li>Gestión de usuarios y roles</li>
                                <li>Configuración del sistema</li>
                                <li>Acceso a todos los módulos</li>
                                <li>Respaldos y mantenimiento</li>
                            </ul>
                        </div>
                    )}

                    {isVendedor() && (
                        <div style={{
                            background: 'rgba(78, 205, 196, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: '0.5rem 0',
                            border: '2px solid #4ecdc4'
                        }}>
                            <h4>💰 Panel de Vendedor</h4>
                            <p>Puedes gestionar ventas y clientes.</p>
                            <ul>
                                <li>Procesar ventas</li>
                                <li>Gestión de clientes</li>
                                <li>Manejo de inventario básico</li>
                                <li>Facturación</li>
                            </ul>
                        </div>
                    )}

                    {isGerenteMercadeo() && (
                        <div style={{
                            background: 'rgba(69, 183, 209, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: '0.5rem 0',
                            border: '2px solid #45b7d1'
                        }}>
                            <h4>📊 Panel de Gerente de Mercadeo</h4>
                            <p>Tienes acceso a herramientas de marketing y análisis.</p>
                            <ul>
                                <li>Campañas de marketing</li>
                                <li>Análisis de mercado</li>
                                <li>Reportes avanzados</li>
                                <li>CRM completo</li>
                            </ul>
                        </div>
                    )}

                    {!isAdmin() && !isVendedor() && !isGerenteMercadeo() && (
                        <div style={{
                            background: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '2px solid #6c757d',
                            textAlign: 'center'
                        }}>
                            <h4>🔒 Sin Rol Específico</h4>
                            <p>Tu usuario no tiene un rol definido en el sistema.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Información de Debug */}
            <div style={{
                marginTop: '2rem',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h4>🔧 Debug: Información Completa del Usuario</h4>
                <pre style={{
                    background: '#e9ecef',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace'
                }}>
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default SimpleRoleDemo;