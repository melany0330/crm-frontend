import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard específico para Gerentes de Mercadeo
 */
const DashboardGerente = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1>📊 Dashboard de Gerente de Mercadeo</h1>
                    <p>Panel de control para análisis y estrategias de marketing</p>
                </div>
                <UserRoleDisplay showFullInfo={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Métricas de Marketing */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #f093fb'
                }}>
                    <h3>📈 Métricas de Marketing</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>85%</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>ROI Campañas</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>12,450</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Leads</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>23%</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Conversión</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>Q 45,200</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Inversión</p>
                        </div>
                    </div>
                </div>

                {/* Herramientas de Marketing */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #f5576c'
                }}>
                    <h3>🎯 Herramientas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button style={{
                            padding: '0.75rem',
                            background: '#f093fb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            📊 Crear Campaña
                        </button>
                        <button style={{
                            padding: '0.75rem',
                            background: '#f5576c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            📈 Análisis de Ventas
                        </button>
                        <button style={{
                            padding: '0.75rem',
                            background: '#e0446b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            🎁 Gestionar Descuentos
                        </button>
                    </div>
                </div>

                {/* Módulos de Marketing */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #cc3d5a',
                    gridColumn: 'span 2'
                }}>
                    <h3>🚀 Módulos de Marketing y Análisis</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>💰 Ventas</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Análisis de ventas</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>👥 CRM</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de clientes</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>🎁 Descuentos</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Promociones y ofertas</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>📊 Reportes</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Análisis e informes</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>🛍️ E-commerce</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Tiendas online</p>
                        </div>
                        <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>📱 Marketing</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Campañas digitales</p>
                        </div>
                    </div>
                </div>

                {/* Campañas Activas */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #10b981'
                }}>
                    <h3>🎯 Campañas Activas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                            🚀 Campaña Navideña - 75% completada
                        </div>
                        <div style={{ padding: '0.75rem', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px' }}>
                            ⭐ Descuentos de Temporada - En progreso
                        </div>
                        <div style={{ padding: '0.75rem', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px' }}>
                            📱 Marketing Digital - Planificación
                        </div>
                    </div>
                </div>

                {/* Objetivos del Mes */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #8b5cf6'
                }}>
                    <h3>🎯 Objetivos del Mes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Aumentar ventas 15%</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                80%
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Captar 500 leads</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#f59e0b', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                65%
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>ROI 90%</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                45%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGerente;