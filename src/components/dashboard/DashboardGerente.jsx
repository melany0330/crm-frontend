import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard específico para Gerentes de Mercadeo
 */
const DashboardGerente = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Funciones de navegación
    const navigateTo = (path) => {
        navigate(path);
    };

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
                    <p>Panel de control especializado en CRM y relación con clientes</p>
                </div>
                <UserRoleDisplay showFullInfo={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Métricas de CRM */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #f093fb'
                }}>
                    <h3>📈 Métricas de CRM</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>2,350</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Clientes Activos</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>12,450</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Nuevos Leads</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>23%</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Conversión</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                            <h4 style={{ margin: 0, color: '#f093fb' }}>85%</h4>
                            <p style={{ margin: '0.5rem 0 0 0' }}>Satisfacción</p>
                        </div>
                    </div>
                </div>

                {/* Herramientas de CRM */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #f5576c'
                }}>
                    <h3>🎯 Herramientas CRM</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            onClick={() => navigateTo('/crm')}
                            style={{
                                padding: '0.75rem',
                                background: '#f093fb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#e879f9'}
                            onMouseOut={(e) => e.target.style.background = '#f093fb'}
                        >
                            � Gestión de Clientes
                        </button>
                        <button
                            onClick={() => navigateTo('/crm/leads')}
                            style={{
                                padding: '0.75rem',
                                background: '#f5576c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#ef4444'}
                            onMouseOut={(e) => e.target.style.background = '#f5576c'}
                        >
                            🎯 Gestión de Leads
                        </button>
                        <button
                            onClick={() => navigateTo('/crm/reports')}
                            style={{
                                padding: '0.75rem',
                                background: '#e0446b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#dc2626'}
                            onMouseOut={(e) => e.target.style.background = '#e0446b'}
                        >
                            📊 Reportes CRM
                        </button>
                    </div>
                </div>

                {/* Módulos de CRM */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #cc3d5a',
                    gridColumn: 'span 2'
                }}>
                    <h3>🚀 Módulos CRM Disponibles</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div
                            onClick={() => navigateTo('/crm/clients')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>👥 Clientes CRM</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de clientes CRM</p>
                        </div>
                        <div
                            onClick={() => navigateTo('/crm/leads')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>🎯 Leads</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Gestión de prospectos</p>
                        </div>
                        <div
                            onClick={() => navigateTo('/crm/campaigns')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>📱 Campañas</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Campañas de marketing</p>
                        </div>
                        <div
                            onClick={() => navigateTo('/crm/reports')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>📊 Reportes</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Análisis e informes</p>
                        </div>
                        <div
                            onClick={() => navigateTo('/crm/analytics')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>� Analytics</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Métricas y KPIs</p>
                        </div>
                        <div
                            onClick={() => navigateTo('/crm/contacts')}
                            style={{
                                padding: '1rem',
                                background: '#fdf2f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#fce7f3';
                                e.target.style.borderColor = '#f093fb';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#fdf2f8';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>� Contactos</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Base de contactos</p>
                        </div>
                    </div>
                </div>

                {/* Campañas CRM Activas */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #10b981'
                }}>
                    <h3>🎯 Campañas CRM Activas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                            � Retención de Clientes - 85% completada
                        </div>
                        <div style={{ padding: '0.75rem', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px' }}>
                            📧 Email Marketing - En progreso
                        </div>
                        <div style={{ padding: '0.75rem', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px' }}>
                            🎯 Segmentación de Leads - Planificación
                        </div>
                    </div>
                </div>

                {/* Objetivos CRM del Mes */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '3px solid #8b5cf6'
                }}>
                    <h3>🎯 Objetivos CRM del Mes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Nuevos clientes +200</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                75%
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Leads calificados 500</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#f59e0b', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                60%
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Satisfacción 90%</span>
                            <span style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                85%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGerente;