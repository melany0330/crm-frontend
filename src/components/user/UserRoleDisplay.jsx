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
        <div className={`user-role-display ${getRoleClass()} ${className}`}>
            {showFullInfo ? (
                <>
                    <div className="user-info">
                        <span className="username">{username}</span>
                        <span className="role-name">{userRoleDisplay || userRole}</span>
                    </div>
                    {getRoleIcon()}
                </>
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
                    gap: 0.5rem;
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }

                .user-role-display:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .username {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #333;
                    margin-bottom: 2px;
                }

                .role-name {
                    font-size: 0.75rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .user-info-compact {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .username-compact {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: #333;
                }

                .role-icon {
                    font-size: 1.2rem;
                    transition: transform 0.2s ease;
                }

                .role-icon:hover {
                    transform: scale(1.1);
                }

                /* Colores por rol */
                .user-role-display.admin .role-icon.admin {
                    color: #ff6b35;
                }

                .user-role-display.admin {
                    border-color: rgba(255, 107, 53, 0.3);
                }

                .user-role-display.vendedor .role-icon.vendedor {
                    color: #4ecdc4;
                }

                .user-role-display.vendedor {
                    border-color: rgba(78, 205, 196, 0.3);
                }

                .user-role-display.gerente .role-icon.gerente {
                    color: #45b7d1;
                }

                .user-role-display.gerente {
                    border-color: rgba(69, 183, 209, 0.3);
                }

                .user-role-display.default .role-icon.default {
                    color: #666;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .user-role-display {
                        padding: 0.25rem;
                    }
                    
                    .user-info {
                        display: none;
                    }
                    
                    .role-icon {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserRoleDisplay;