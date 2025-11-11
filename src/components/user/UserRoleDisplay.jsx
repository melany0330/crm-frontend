import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    // Función para navegar al dashboard
    const handleClick = () => {
        navigate('/dashboard');
    };

    // Si está cargando o no está autenticado, no mostrar nada
    if (loading || !isAuthenticated || !user) {
        return null;
    }

    // Obtener icono según el rol
    const getRoleIcon = () => {
        if (isAdmin()) return <FaCrown title="Administrador" />;
        if (isVendedor()) return <FaUserTie title="Vendedor" />;
        if (isGerenteMercadeo()) return <FaChartLine title="Gerente de Mercadeo" />;
        return <FaUser title="Usuario" />;
    };



    // Obtener color del icono según el rol
    const getRoleIconColor = () => {
        if (isAdmin()) return '#ff6b35';
        if (isVendedor()) return '#4ecdc4';
        if (isGerenteMercadeo()) return '#45b7d1';
        return '#666';
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        border: '1px solid transparent',
        cursor: 'pointer',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'
    };

    const inlineInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.9rem'
    };

    const usernameStyle = {
        fontWeight: 600,
        color: isHovered ? '#fff' : '#e3e2e2ff',
        transition: 'color 0.3s ease'
    };

    const separatorStyle = {
        color: isHovered ? '#ccc' : '#666',
        transition: 'color 0.3s ease'
    };

    const roleNameStyle = {
        fontWeight: 500,
        color: isHovered ? '#ddd' : '#bbb',
        textTransform: 'capitalize',
        transition: 'color 0.3s ease'
    };

    const iconWrapperStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '0.25rem'
    };

    const compactInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem'
    };

    const usernameCompactStyle = {
        fontWeight: 600,
        fontSize: '0.85rem',
        color: '#777'
    };

    const roleIconStyle = {
        fontSize: '1rem',
        transition: 'transform 0.2s ease',
        verticalAlign: 'middle',
        color: getRoleIconColor()
    };

    return (
        <div
            style={containerStyle}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Ir al Dashboard"
            className={className}
        >
            {showFullInfo ? (
                <span style={inlineInfoStyle}>
                    <span style={usernameStyle}>{username}</span>
                    <span style={separatorStyle}> - </span>
                    <span style={roleNameStyle}>{userRoleDisplay || userRole}</span>
                    <span style={iconWrapperStyle}>
                        <div style={roleIconStyle}>
                            {getRoleIcon()}
                        </div>
                    </span>
                </span>
            ) : (
                <div style={compactInfoStyle}>
                    <div style={roleIconStyle}>
                        {getRoleIcon()}
                    </div>
                    <span style={usernameCompactStyle}>{username}</span>
                </div>
            )}
        </div>
    );
};

export default UserRoleDisplay;