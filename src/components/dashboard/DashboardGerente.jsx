import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../../hooks/useDashboardData';
import { LoadingCard, ErrorCard, StatCard, StatsGrid, LastUpdated } from './DashboardComponents';
import { KPISummary } from './DashboardDetailStats';
import UserRoleDisplay from '../user/UserRoleDisplaySimple';

/**
 * Dashboard específico para Gerentes de Mercadeo
 */
const DashboardGerente = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Hook para datos CRM
    const { data: gerenteData, loading, error, lastUpdated, refresh } = useDashboardData('gerente', true);

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
                {loading ? (
                    <LoadingCard title="Cargando métricas CRM..." />
                ) : error ? (
                    <ErrorCard
                        title="Error al cargar métricas CRM"
                        message={error}
                        onRetry={refresh}
                    />
                ) : (
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        border: '3px solid #f093fb'
                    }}>
                        <h3>📈 Métricas de CRM</h3>
                        <StatsGrid columns={2}>
                            <StatCard
                                title="Clientes Activos"
                                value={gerenteData?.clientesActivos || 0}
                                color="#f093fb"
                                icon="👥"
                                format="number"
                            />
                            <StatCard
                                title="Nuevos Leads"
                                value={gerenteData?.nuevosLeads || 0}
                                color="#f093fb"
                                icon="🎯"
                                format="number"
                            />
                            <StatCard
                                title="Conversión"
                                value={gerenteData?.tasaConversion || 0}
                                color="#f093fb"
                                icon="📊"
                                format="percentage"
                            />
                            <StatCard
                                title="Satisfacción"
                                value={gerenteData?.satisfaccion || 0}
                                color="#f093fb"
                                icon="⭐"
                                format="percentage"
                            />
                        </StatsGrid>
                    </div>
                )}

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
                {loading ? (
                    <LoadingCard title="Cargando campañas activas..." />
                ) : error ? (
                    <ErrorCard
                        title="Error al cargar campañas"
                        message="No se pudieron cargar las campañas activas"
                        onRetry={refresh}
                    />
                ) : (
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        border: '3px solid #10b981'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>🎯 Campañas CRM Activas</h3>
                            <span style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                background: '#f8f9fa',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                            }}>
                                Total: {gerenteData?.totalCampanas || 0}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {gerenteData?.campanasActivas && gerenteData.campanasActivas.length > 0 ? (
                                gerenteData.campanasActivas.map((campaign, index) => {
                                    const getStatusColor = (status) => {
                                        switch (status?.toLowerCase()) {
                                            case 'activa': return { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' };
                                            case 'completada': return { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' };
                                            case 'pausada': return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' };
                                            default: return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' };
                                        }
                                    };

                                    const statusColors = getStatusColor(campaign.status);
                                    const progress = campaign.progress || 0;

                                    return (
                                        <div
                                            key={campaign.id || index}
                                            style={{
                                                padding: '0.75rem',
                                                background: statusColors.bg,
                                                border: `1px solid ${statusColors.border}`,
                                                borderRadius: '8px',
                                                color: statusColors.text
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <strong>{campaign.name || 'Campaña sin nombre'}</strong>
                                                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                        {campaign.type && `${campaign.type} • `}
                                                        {progress}% completada
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                                                    {campaign.conversionRate > 0 && (
                                                        <div>📈 {campaign.conversionRate}%</div>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Barra de progreso */}
                                            <div style={{
                                                width: '100%',
                                                height: '4px',
                                                background: '#e5e7eb',
                                                borderRadius: '2px',
                                                marginTop: '0.5rem',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${progress}%`,
                                                    height: '100%',
                                                    background: progress >= 80 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#ef4444',
                                                    transition: 'width 0.3s ease'
                                                }}></div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    color: '#6b7280'
                                }}>
                                    📝 No hay campañas activas en este momento
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Objetivos CRM del Mes */}
                {loading ? (
                    <LoadingCard title="Cargando objetivos del mes..." />
                ) : error ? (
                    <ErrorCard
                        title="Error al cargar objetivos"
                        message="No se pudieron cargar los objetivos del mes"
                        onRetry={refresh}
                    />
                ) : (
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        border: '3px solid #8b5cf6'
                    }}>
                        <h3>🎯 Objetivos CRM del Mes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {gerenteData?.objetivosMes && gerenteData.objetivosMes.length > 0 ? (
                                gerenteData.objetivosMes.map((objetivo, index) => {
                                    const getProgressColor = (progreso) => {
                                        if (progreso >= 80) return '#10b981'; // Verde
                                        if (progreso >= 60) return '#f59e0b'; // Amarillo
                                        if (progreso >= 40) return '#fb923c'; // Naranja
                                        return '#ef4444'; // Rojo
                                    };

                                    const progressColor = getProgressColor(objetivo.progreso);

                                    return (
                                        <div
                                            key={objetivo.id || index}
                                            style={{
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                background: '#fafafa'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '500' }}>
                                                    {objetivo.titulo}
                                                </span>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: progressColor,
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {objetivo.progreso}%
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                Actual: <strong>{objetivo.actual.toLocaleString()}</strong> / Objetivo: <strong>{objetivo.objetivo.toLocaleString()}</strong>
                                            </div>
                                            {/* Barra de progreso */}
                                            <div style={{
                                                width: '100%',
                                                height: '6px',
                                                background: '#e5e7eb',
                                                borderRadius: '3px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${Math.min(objetivo.progreso, 100)}%`,
                                                    height: '100%',
                                                    background: progressColor,
                                                    transition: 'width 0.3s ease'
                                                }}></div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    color: '#6b7280'
                                }}>
                                    🎯 No hay objetivos definidos para este mes
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Indicador de última actualización */}
            <LastUpdated timestamp={lastUpdated} onRefresh={refresh} />
        </div>
    );
};

export default DashboardGerente;