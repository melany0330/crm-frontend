import AuthService from "../../service/auth/AuthService";
import { getRoleById, getRoleByName, isValidRoleId, isValidRoleName } from "./RoleMapping";

class APIUtil {

    static validateSession() {
        const authService = new AuthService();
        const token = authService.getToken();

        if (!token || !token.getToken() || !token.isValid()) {
            return false;
        }
        return true;
    }

    static redirectIfNotAuthenticated(navigate) {
        navigate('/account', { replace: true });
    }

    static redirectIfAuthenticated(navigate) {
        navigate('/dashboard', { replace: true });
    }

    static getAuthToken() {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.getToken() : null;
    }

    static getRefreshToken() {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.getRefreshToken() : null;
    }

    static getUserName() {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.getUserName() : null;
    }

    /**
     * Obtiene el ID del usuario actual
     * @returns {number|null} ID del usuario o null si no está autenticado
     */
    static getUserId() {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.getUserId() : null;
    }

    /**
     * Obtiene el ID del rol del usuario actual
     * @returns {number|null} ID del rol o null si no está autenticado
     */
    static getUserRoleId() {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.getRoleId() : null;
    }

    /**
     * Obtiene el nombre del rol del usuario actual
     * @returns {string|null} Nombre del rol o null si no está disponible
     */
    static getUserRoleName() {
        const authService = new AuthService();
        const token = authService.getToken();
        const roleId = token ? token.getRoleId() : null;

        if (roleId) {
            const roleInfo = getRoleById(roleId);
            return roleInfo ? roleInfo.name : null;
        }

        return token ? token.getRoleName() : null;
    }

    /**
     * Obtiene información completa del rol del usuario
     * @returns {Object|null} Información del rol o null si no está disponible
     */
    static getUserRole() {
        const roleId = this.getUserRoleId();
        return roleId ? getRoleById(roleId) : null;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string|number} role - Nombre o ID del rol a verificar
     * @returns {boolean} True si el usuario tiene el rol especificado
     */
    static hasRole(role) {
        const userRoleId = this.getUserRoleId();

        if (!userRoleId) {
            return false;
        }

        // Convertir userRoleId a número para comparaciones consistentes
        const userRoleIdNumber = parseInt(userRoleId, 10);

        if (typeof role === 'string') {
            const roleInfo = getRoleByName(role);
            const hasRoleResult = roleInfo ? roleInfo.id === userRoleIdNumber : false;
            return hasRoleResult;
        } else if (typeof role === 'number') {
            const hasRoleResult = role === userRoleIdNumber;
            return hasRoleResult;
        }

        return false;
    }

    /**
     * Verifica si el usuario tiene al menos uno de los roles especificados
     * @param {Array<string|number>} roles - Array de nombres o IDs de roles
     * @returns {boolean} True si el usuario tiene al menos uno de los roles
     */
    static hasAnyRole(roles) {
        if (!Array.isArray(roles) || roles.length === 0) return true;

        return roles.some(role => this.hasRole(role));
    }

    /**
     * Verifica si el usuario tiene todos los roles especificados
     * @param {Array<string|number>} roles - Array de nombres o IDs de roles
     * @returns {boolean} True si el usuario tiene todos los roles
     */
    static hasAllRoles(roles) {
        if (!Array.isArray(roles) || roles.length === 0) return true;

        return roles.every(role => this.hasRole(role));
    }

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean} True si el usuario tiene rol de administrador
     */
    static isAdmin() {
        return this.hasRole('ADMINISTRADOR');
    }

    /**
     * Verifica si el usuario es vendedor
     * @returns {boolean} True si el usuario tiene rol de vendedor
     */
    static isVendedor() {
        return this.hasRole('VENDEDOR');
    }

    /**
     * Verifica si el usuario es gerente de mercadeo
     * @returns {boolean} True si el usuario tiene rol de gerente de mercadeo
     */
    static isGerenteMercadeo() {
        return this.hasRole('GERENTE_MERCADEO');
    }

    /**
     * Verifica si el token está próximo a expirar
     * @param {number} warningMinutes - Minutos antes de la expiración
     * @returns {boolean} True si el token expira pronto
     */
    static isTokenExpiringSoon(warningMinutes = 5) {
        const authService = new AuthService();
        const token = authService.getToken();
        return token ? token.isExpiringSoon(warningMinutes) : false;
    }

    /**
     * Obtiene toda la información del usuario desde el token
     * @returns {Object|null} Información completa del usuario
     */
    static getCurrentUser() {

        const authService = new AuthService();
        const token = authService.getToken();

        if (!token) {
            return null;
        }

        const userInfo = token.getUserInfo();

        // Usar APIUtil en lugar de this para evitar problemas de contexto
        const roleInfo = APIUtil.getUserRole();

        const currentUser = {
            id: token.getUserId(),
            username: token.getUserName(),
            roleId: token.getRoleId(),
            roleName: roleInfo?.name || null,
            roleDisplayName: roleInfo?.displayName || null,
            token: token.getToken(),
            isValid: token.isValid(),
            isExpiringSoon: token.isExpiringSoon(),
            ...userInfo
        };

        return currentUser;
    }
}

// Exportaciones nombradas para facilitar el uso - con binding correcto
export const validateSession = APIUtil.validateSession.bind(APIUtil);
export const redirectIfNotAuthenticated = APIUtil.redirectIfNotAuthenticated.bind(APIUtil);
export const redirectIfAuthenticated = APIUtil.redirectIfAuthenticated.bind(APIUtil);
export const getAuthToken = APIUtil.getAuthToken.bind(APIUtil);
export const getRefreshToken = APIUtil.getRefreshToken.bind(APIUtil);
export const getUserName = APIUtil.getUserName.bind(APIUtil);
export const getUserId = APIUtil.getUserId.bind(APIUtil);
export const getUserRoleId = APIUtil.getUserRoleId.bind(APIUtil);
export const getUserRoleName = APIUtil.getUserRoleName.bind(APIUtil);
export const getUserRole = APIUtil.getUserRole.bind(APIUtil);
export const hasRole = APIUtil.hasRole.bind(APIUtil);
export const hasAnyRole = APIUtil.hasAnyRole.bind(APIUtil);
export const hasAllRoles = APIUtil.hasAllRoles.bind(APIUtil);
export const isAdmin = APIUtil.isAdmin.bind(APIUtil);
export const isVendedor = APIUtil.isVendedor.bind(APIUtil);
export const isGerenteMercadeo = APIUtil.isGerenteMercadeo.bind(APIUtil);
export const isTokenExpiringSoon = APIUtil.isTokenExpiringSoon.bind(APIUtil);
export const getCurrentUser = APIUtil.getCurrentUser.bind(APIUtil);

export default APIUtil;