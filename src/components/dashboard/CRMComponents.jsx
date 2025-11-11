// src/components/dashboard/CRMComponents.jsx
import React from 'react';

/**
 * Componente para mostrar una campaña CRM individual
 */
export const CampaignCard = ({ campaign, onClick }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'activa': return { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', dot: '#10b981' };
            case 'completada': return { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', dot: '#3b82f6' };
            case 'pausada': return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' };
            case 'planificada': return { bg: '#f3e8ff', border: '#c4b5fd', text: '#5b21b6', dot: '#8b5cf6' };
            default: return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151', dot: '#6b7280' };
        }
    };

    const statusColors = getStatusColor(campaign.status);
    const progress = campaign.progress || 0;

    return (
        <div
            style={{
                padding: '1rem',
                background: statusColors.bg,
                border: `2px solid ${statusColors.border}`,
                borderRadius: '12px',
                color: statusColors.text,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}
            onClick={onClick}
            onMouseOver={(e) => {
                if (onClick) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }
            }}
            onMouseOut={(e) => {
                if (onClick) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }
            }}
        >
            {/* Indicador de estado */}
            <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: statusColors.dot
            }}></div>

            {/* Título y descripción */}
            <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: '600' }}>
                    {campaign.name || 'Campaña sin nombre'}
                </h4>
                {campaign.description && (
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.3' }}>
                        {campaign.description.length > 80
                            ? `${campaign.description.substring(0, 80)}...`
                            : campaign.description
                        }
                    </p>
                )}
            </div>

            {/* Información adicional */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem' }}>
                    {campaign.type && (
                        <span style={{
                            background: 'rgba(0,0,0,0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            marginRight: '0.5rem'
                        }}>
                            {campaign.type}
                        </span>
                    )}
                    <span>{progress}% completada</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    {campaign.conversionRate > 0 && (
                        <div>📈 {campaign.conversionRate}% conversión</div>
                    )}
                    {campaign.budget > 0 && (
                        <div>💰 Q{campaign.budget.toLocaleString()}</div>
                    )}
                </div>
            </div>

            {/* Barra de progreso */}
            <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: '100%',
                    background: statusColors.dot,
                    transition: 'width 0.3s ease'
                }}></div>
            </div>

            {/* Fechas */}
            {(campaign.startDate || campaign.endDate) && (
                <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    {campaign.startDate && (
                        <span>📅 Inicio: {new Date(campaign.startDate).toLocaleDateString()}</span>
                    )}
                    {campaign.endDate && (
                        <span>🏁 Fin: {new Date(campaign.endDate).toLocaleDateString()}</span>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Componente para mostrar un objetivo CRM individual
 */
export const ObjectiveCard = ({ objective, showDetails = true }) => {
    const getProgressColor = (progreso) => {
        if (progreso >= 80) return '#10b981'; // Verde
        if (progreso >= 60) return '#f59e0b'; // Amarillo
        if (progreso >= 40) return '#fb923c'; // Naranja
        return '#ef4444'; // Rojo
    };

    const getProgressIcon = (progreso) => {
        if (progreso >= 80) return '🎯';
        if (progreso >= 60) return '📊';
        if (progreso >= 40) return '⚠️';
        return '🔴';
    };

    const progressColor = getProgressColor(objective.progreso);
    const progressIcon = getProgressIcon(objective.progreso);

    return (
        <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1rem',
            background: 'white',
            transition: 'all 0.2s ease'
        }}
            onMouseOver={(e) => {
                e.target.style.borderColor = progressColor;
                e.target.style.boxShadow = `0 2px 8px ${progressColor}33`;
            }}
            onMouseOut={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
            }}>
            {/* Título y progreso */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{progressIcon}</span>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                        {objective.titulo}
                    </span>
                </div>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    background: progressColor,
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    {objective.progreso}%
                </span>
            </div>

            {/* Detalles si se muestran */}
            {showDetails && (
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Actual:</span>
                        <span style={{ fontWeight: '600', color: '#374151' }}>
                            {objective.tipo === 'satisfaccion'
                                ? `${objective.actual}%`
                                : objective.actual.toLocaleString()
                            }
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Objetivo:</span>
                        <span style={{ fontWeight: '600', color: '#374151' }}>
                            {objective.tipo === 'satisfaccion'
                                ? `${objective.objetivo}%`
                                : objective.objetivo.toLocaleString()
                            }
                        </span>
                    </div>
                </div>
            )}

            {/* Barra de progreso */}
            <div style={{
                width: '100%',
                height: '8px',
                background: '#f3f4f6',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    width: `${Math.min(objective.progreso, 100)}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
                    transition: 'width 0.5s ease',
                    borderRadius: '4px'
                }}></div>

                {/* Indicador de meta (100%) */}
                {objective.progreso < 100 && (
                    <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        width: '2px',
                        height: '100%',
                        background: '#d1d5db'
                    }}></div>
                )}
            </div>

            {/* Mensaje de estado */}
            {objective.progreso >= 100 && (
                <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#065f46',
                    textAlign: 'center'
                }}>
                    🎉 ¡Objetivo completado!
                </div>
            )}
        </div>
    );
};

/**
 * Componente para mostrar estadísticas resumidas de campañas
 */
export const CampaignStatsOverview = ({ stats }) => {
    if (!stats || Object.keys(stats).length === 0) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '1rem'
        }}>
            {stats.activas !== undefined && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>
                        {stats.activas}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Activas</div>
                </div>
            )}
            {stats.completadas !== undefined && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3b82f6' }}>
                        {stats.completadas}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Completadas</div>
                </div>
            )}
            {stats.totalBudget !== undefined && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f59e0b' }}>
                        Q{stats.totalBudget.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Presupuesto</div>
                </div>
            )}
            {stats.avgConversionRate !== undefined && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#8b5cf6' }}>
                        {stats.avgConversionRate}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Conversión Prom.</div>
                </div>
            )}
        </div>
    );
};

export default {
    CampaignCard,
    ObjectiveCard,
    CampaignStatsOverview
};