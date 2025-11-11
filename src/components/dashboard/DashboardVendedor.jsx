import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard específico para Vendedores
 */
const DashboardVendedor = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1>💰 Dashboard de Ventas</h1>
                    <p>Panel de control para gestión de ventas y clientes</p>
                </div>
                <UserRoleDisplay showFullInfo={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Estadísticas de Ventas */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #4ecdc4'
                }}>
                    <h3>📊 Estadísticas de Ventas</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#4ecdc4' }}>Q 12,500</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Ventas Hoy</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#4ecdc4' }}>Q 89,200</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Ventas Mes</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#4ecdc4' }}>24</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Órdenes Hoy</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#4ecdc4' }}>156</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Clientes</p>
                        </div>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #44a08d'
                }}>
                    <h3>⚡ Acciones Rápidas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button style={{
                            padding: '0.75rem',
                            background: '#4ecdc4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            🛒 Nueva Venta
                        </button>
                        <button style={{
                            padding: '0.75rem',
                            background: '#44a08d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            👥 Gestionar Clientes
                        </button>
                        <button style={{
                            padding: '0.75rem',
                            background: '#36877d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            📦 Ver Productos
                        </button>
                    </div>
                </div>

                {/* Módulos Disponibles */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #2c7c73',
                    gridColumn: 'span 2'
                }}>
                    <h3>🏪 Módulos Disponibles para Vendedores</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#e8f8f6', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>💰 Ventas</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Procesar y gestionar ventas</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#e8f8f6', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>👥 Clientes</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de clientes</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#e8f8f6', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>📦 Productos</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Catálogo de productos</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#e8f8f6', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>🍰 Pasteles</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de pasteles</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#e8f8f6', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>🛒 Ecommerce</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Tienda online</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardVendedor;