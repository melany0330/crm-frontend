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
        if (isAdmin()) return <FaCrown className="role-icon admin" title="Administrador" />;
        if (isVendedor()) return <FaUserTie className="role-icon vendedor" title="Vendedor" />;
        if (isGerenteMercadeo()) return <FaChartLine className="role-icon gerente" title="Gerente de Mercadeo" />;
        return <FaUser className="role-icon default" title="Usuario" />;
    };

    // Obtener clase CSS según el rol
    const getRoleClass = () => {
        if (isAdmin()) return 'admin';
        if (isVendedor()) return 'vendedor';
        if (isGerenteMercadeo()) return 'gerente';
        return 'default';
    };

    return (
        <div
            className={`user-role-display ${getRoleClass()} ${className}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            title="Ir al Dashboard"
        >
            {showFullInfo ? (
                <span className="user-info-inline">
                    <span className="username">{username}</span>
                    <span className="separator"> - </span>
                    <span className="role-name">{userRoleDisplay || userRole}</span>
                    <span className="icon-wrapper">{getRoleIcon()}</span>
                </span>
            ) : (
                <div className="user-info-compact">
                    {getRoleIcon()}
                    <span className="username-compact">{username}</span>
                </div>
            )}

            <style jsx>{`
                .user-role-display {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }

                .user-role-display:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .user-info-inline {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                }

                .username {
                    font-weight: 600;
                    color: #e3e2e2ff;
                    transition: color 0.3s ease;
                }

                .separator {
                    color: #666;
                    transition: color 0.3s ease;
                }

                .role-name {
                    font-weight: 500;
                    color: #bbb;
                    text-transform: capitalize;
                    transition: color 0.3s ease;
                }

                .user-role-display:hover .username {
                    color: #fff;
                }

                .user-role-display:hover .separator {
                    color: #ccc;
                }

                .user-role-display:hover .role-name {
                    color: #ddd;
                }

                .icon-wrapper {
                    display: inline-flex;
                    align-items: center;
                    margin-left: 0.25rem;
                }

                .user-info-compact {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .username-compact {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: #777;
                }

                .role-icon {
                    font-size: 1rem;
                    transition: transform 0.2s ease;
                    vertical-align: middle;
                }

                .role-icon:hover {
                    transform: scale(1.1);
                }

                /* Colores por rol */
                .user-role-display.admin .role-icon.admin {
                    color: #ff6b35;
                }

                .user-role-display.vendedor .role-icon.vendedor {
                    color: #4ecdc4;
                }

                .user-role-display.gerente .role-icon.gerente {
                    color: #45b7d1;
                }

                .user-role-display.default .role-icon.default {
                    color: #666;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .user-info-inline {
                        font-size: 0.8rem;
                    }
                    
                    .role-icon {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserRoleDisplay;