// src/components/dashboard/DashboardComponents.jsx
import React from 'react';

/**
 * Componente para mostrar estado de carga
 */
export const LoadingCard = ({ title = "Cargando..." }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '3px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '150px'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: '#666', margin: 0 }}>{title}</p>
        </div>
    </div>
);

/**
 * Componente para mostrar errores
 */
export const ErrorCard = ({ title = "Error", message, onRetry }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '3px solid #f56565',
        textAlign: 'center'
    }}>
        <div style={{ color: '#f56565', fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ color: '#f56565', margin: '0 0 1rem 0' }}>{title}</h3>
        <p style={{ color: '#666', margin: '0 0 1rem 0' }}>{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f56565',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#e53e3e'}
                onMouseOut={(e) => e.target.style.background = '#f56565'}
            >
                🔄 Reintentar
            </button>
        )}
    </div>
);

/**
 * Componente para estadísticas numéricas
 */
export const StatCard = ({
    title,
    value,
    color = '#667eea',
    icon = '📊',
    subtitle,
    format = 'number' // 'number', 'currency', 'percentage'
}) => {
    const formatValue = (val) => {
        if (val === null || val === undefined) return '0';

        switch (format) {
            case 'currency':
                return `Q ${val.toLocaleString()}`;
            case 'percentage':
                return `${val}%`;
            default:
                return val.toLocaleString();
        }
    };

    return (
        <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
        }}
            onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
            }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{icon}</div>
            <h4 style={{ margin: 0, color, fontSize: '1.5rem' }}>
                {formatValue(value)}
            </h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                {title}
            </p>
            {subtitle && (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

/**
 * Componente para alertas del sistema
 */
export const AlertCard = ({ alerts = [], loading = false, onRefresh }) => {
    if (loading) {
        return <LoadingCard title="Cargando alertas..." />;
    }

    const getAlertStyle = (type) => {
        const styles = {
            warning: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030' },
            success: { background: '#f0fff4', border: '1px solid #9ae6b4', color: '#38a169' },
            info: { background: '#fffbf0', border: '1px solid #faf089', color: '#d69e2e' },
            error: { background: '#fef5e7', border: '1px solid #f6ad55', color: '#dd6b20' }
        };
        return styles[type] || styles.info;
    };

    const getAlertIcon = (type) => {
        const icons = {
            warning: '⚠️',
            success: '✅',
            info: '📊',
            error: '❌'
        };
        return icons[type] || '📝';
    };

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #ff6b6b'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>🚨 Alertas del Sistema</h3>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        style={{
                            padding: '0.5rem',
                            background: 'transparent',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                        title="Actualizar alertas"
                    >
                        🔄
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {alerts.length === 0 ? (
                    <div style={{
                        padding: '1rem',
                        background: '#f0fff4',
                        border: '1px solid #9ae6b4',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#38a169'
                    }}>
                        ✅ No hay alertas pendientes
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                ...getAlertStyle(alert.type)
                            }}
                        >
                            <span>{getAlertIcon(alert.type)}</span>
                            <span>{alert.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

/**
 * Componente de contenedor para grid de estadísticas
 */
export const StatsGrid = ({ children, columns = 2 }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem'
    }}>
        {children}
    </div>
);

/**
 * Componente para indicador de última actualización
 */
export const LastUpdated = ({ timestamp, onRefresh }) => {
    if (!timestamp) return null;

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            margin: '1rem 0',
            fontSize: '0.9rem',
            color: '#666'
        }}>
            <span>
                📅 Última actualización: {formatTime(timestamp)}
            </span>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    style={{
                        padding: '0.25rem 0.75rem',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    🔄 Actualizar
                </button>
            )}
        </div>
    );
};

// Agregar animación de spin para el loading
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);