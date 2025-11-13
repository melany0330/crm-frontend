import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente para proteger contenido basado en roles
 * @param {Array} roles - Array de roles permitidos
 * @param {React.Component} children - Componentes hijos a renderizar si tiene permisos
 * @param {React.Component} fallback - Componente a mostrar si no tiene permisos
 * @param {string} requireAll - Si true, requiere todos los roles. Si false, requiere al menos uno
 */
const RoleProtectedComponent = ({
    roles = [],
    children,
    fallback = null,
    requireAll = false,
    className = ""
}) => {
    const { hasAnyRole, hasAllRoles, isAuthenticated, loading } = useAuth();

    // Si está cargando, mostrar un indicador de carga
    if (loading) {
        return (
            <div className={`role-protected-loading ${className}`}>
                <div className="loading-spinner">
                    <i className="fa fa-spinner fa-spin"></i>
                    <span>Verificando permisos...</span>
                </div>
            </div>
        );
    }

    // Si no está autenticado, no mostrar nada
    if (!isAuthenticated) {
        return fallback || null;
    }

    // Verificar permisos según la configuración
    const hasPermission = requireAll
        ? hasAllRoles(roles)
        : hasAnyRole(roles);

    // Si no tiene permisos, mostrar fallback o no mostrar nada
    if (!hasPermission) {
        return fallback || (
            <div className={`role-protected-denied ${className}`}>
                <div className="access-denied">
                    <i className="fa fa-lock"></i>
                    <p>No tienes permisos para ver este contenido</p>
                </div>
            </div>
        );
    }

    // Si tiene permisos, mostrar el contenido
    return (
        <div className={`role-protected-content ${className}`} style={{ width: '100%' }}>
            {children}
        </div>
    );
};

/**
 * Hook para verificar permisos de roles de forma condicional
 * @param {Array} roles - Roles requeridos
 * @param {boolean} requireAll - Si requiere todos los roles
 * @returns {Object} Objeto con estado de permisos
 */
export const useRolePermission = (roles = [], requireAll = false) => {
    const { hasAnyRole, hasAllRoles, isAuthenticated, loading, user } = useAuth();

    const hasPermission = isAuthenticated && (requireAll
        ? hasAllRoles(roles)
        : hasAnyRole(roles));

    return {
        hasPermission,
        isAuthenticated,
        loading,
        user,
        canAccess: hasPermission,
        isAuthorized: hasPermission
    };
};

export default RoleProtectedComponent;