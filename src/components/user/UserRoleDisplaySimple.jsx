import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaCrown, FaUserTie, FaChartLine } from 'react-icons/fa';

/**
 * Componente para mostrar información del usuario y su rol en el header
 */
const UserRoleDisplay = ({ showFullInfo = true, className = "" }) => {
    const {
        user,
        isAuthenticated,
        loading,
        userRole,
        userRoleDisplay,
        username,
        isAdmin,
        isVendedor,
        isGerenteMercadeo
    } = useAuth();

    // Si está cargando o no está autenticado, no mostrar nada
    if (loading || !isAuthenticated || !user) {
        return null;
    }

    // Obtener icono y color según el rol
    const getRoleIcon = () => {
        if (isAdmin()) return <FaCrown style={{ color: '#ff6b35', fontSize: '1.2rem' }} title="Administrador" />;
        if (isVendedor()) return <FaUserTie style={{ color: '#4ecdc4', fontSize: '1.2rem' }} title="Vendedor" />;
        if (isGerenteMercadeo()) return <FaChartLine style={{ color: '#45b7d1', fontSize: '1.2rem' }} title="Gerente de Mercadeo" />;
        return <FaUser style={{ color: '#666', fontSize: '1.2rem' }} title="Usuario" />;
    };

    // Obtener color de borde según el rol
    const getBorderColor = () => {
        if (isAdmin()) return 'rgba(255, 107, 53, 0.3)';
        if (isVendedor()) return 'rgba(78, 205, 196, 0.3)';
        if (isGerenteMercadeo()) return 'rgba(69, 183, 209, 0.3)';
        return 'rgba(255, 255, 255, 0.2)';
    };

    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${getBorderColor()}`,
        transition: 'all 0.3s ease',
        cursor: 'default'
    };

    const userInfoStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    };

    const usernameStyle = {
        fontWeight: 600,
        fontSize: '0.9rem',
        color: '#333',
        marginBottom: '2px'
    };

    const roleNameStyle = {
        fontSize: '0.75rem',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const compactStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem'
    };

    const usernameCompactStyle = {
        fontWeight: 600,
        fontSize: '0.85rem',
        color: '#333'
    };

    return (
        <div
            style={baseStyle}
            className={className}
            onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
            }}
        >
            {showFullInfo ? (
                <>
                    <div style={userInfoStyle}>
                        <span style={usernameStyle}>{username}</span>
                        <span style={roleNameStyle}>{userRoleDisplay || userRole}</span>
                    </div>
                    {getRoleIcon()}
                </>
            ) : (
                <div style={compactStyle}>
                    {getRoleIcon()}
                    <span style={usernameCompactStyle}>{username}</span>
                </div>
            )}
        </div>
    );
};

export default UserRoleDisplay;