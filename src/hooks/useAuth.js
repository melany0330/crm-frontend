import { useState, useEffect, useCallback } from 'react';
import AuthService from '../service/auth/AuthService';
import APIUtil from '../core/system/APIUtil';
import Token from '../model/auth/Token';

/**
 * Hook personalizado para manejar autenticación y roles
 * @returns {Object} Objeto con información del usuario, funciones de autenticación y utilidades de roles
 */
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const authService = new AuthService();

    /**
     * Actualiza la información del usuario desde el token
     */
    const updateUserInfo = useCallback(() => {
        try {
            const currentUser = APIUtil.getCurrentUser();

            if (currentUser && currentUser.isValid) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ [useAuth] Error al obtener información del usuario:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Función de login
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise} Promesa que se resuelve con el resultado del login
     */
    const login = useCallback(async (username, password) => {
        setLoading(true);
        try {
            const response = await authService.login(username, password);
            if (response && response.data) {
                const token = Token.build(response, username);
                authService.saveToken(token);
                updateUserInfo();
                return { success: true, data: response.data };
            }
            throw new Error('Respuesta de login inválida');
        } catch (error) {
            setLoading(false);
            return { success: false, error: error.message };
        }
    }, [authService, updateUserInfo]);

    /**
     * Función de logout
     */
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            authService.clearToken();
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [authService]);

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string|number} role - Nombre o ID del rol
     * @returns {boolean}
     */
    const hasRole = useCallback((role) => {
        return APIUtil.hasRole(role);
    }, []);

    /**
     * Verifica si el usuario tiene al menos uno de los roles especificados
     * @param {Array} roles - Array de roles
     * @returns {boolean}
     */
    const hasAnyRole = useCallback((roles) => {
        return APIUtil.hasAnyRole(roles);
    }, []);

    /**
     * Verifica si el usuario tiene todos los roles especificados
     * @param {Array} roles - Array de roles
     * @returns {boolean}
     */
    const hasAllRoles = useCallback((roles) => {
        return APIUtil.hasAllRoles(roles);
    }, []);

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean}
     */
    const isAdmin = useCallback(() => {
        return APIUtil.isAdmin();
    }, []);

    /**
     * Verifica si el usuario es vendedor
     * @returns {boolean}
     */
    const isVendedor = useCallback(() => {
        return APIUtil.isVendedor();
    }, []);

    /**
     * Verifica si el usuario es gerente de mercadeo
     * @returns {boolean}
     */
    const isGerenteMercadeo = useCallback(() => {
        return APIUtil.isGerenteMercadeo();
    }, []);

    /**
     * Refresca la información del usuario
     */
    const refreshUser = useCallback(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    // Efecto para cargar la información del usuario al montar el componente
    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    // Efecto para verificar si el token está próximo a expirar
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const checkTokenExpiration = () => {
            if (APIUtil.isTokenExpiringSoon(5)) {
                console.warn('Token expirará pronto. Considera implementar renovación automática.');
                // Aquí podrías implementar lógica para renovar el token automáticamente
            }
        };

        // Verificar cada minuto
        const interval = setInterval(checkTokenExpiration, 60000);

        // Verificar inmediatamente
        checkTokenExpiration();

        return () => clearInterval(interval);
    }, [isAuthenticated, user]);

    return {
        // Estado del usuario
        user,
        loading,
        isAuthenticated,

        // Funciones de autenticación
        login,
        logout,
        refreshUser,

        // Funciones de roles
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin,
        isVendedor,
        isGerenteMercadeo,

        // Información del rol actual
        userRole: user?.roleName || null,
        userRoleDisplay: user?.roleDisplayName || null,
        userId: user?.id || null,
        username: user?.username || null,

        // Estado del token
        isTokenExpiringSoon: user?.isExpiringSoon || false
    };
};