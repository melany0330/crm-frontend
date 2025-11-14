import ServerService from '../../core/service/ServerService.js';
import Token from '../../model/auth/Token.js';

class AuthService {
    constructor() {
        this.serverService = new ServerService();
    }

    login(username, password) {
        const data = {
            userName: username,
            password: password
        };
        // Usar la variable de entorno con fallback
        const authPath = import.meta.env.VITE_WMS_API_AUTH || '/api/auth';
        return this.serverService.send(`${authPath}/login`, 'POST', null, data);
    }

    logout() {
        const token = this.getToken();
        const authPath = import.meta.env.VITE_WMS_API_AUTH || '/api/auth';
        return this.serverService.authSend(`${authPath}/logout`, 'POST');
    }

    saveToken(token) {
        if (typeof window !== 'undefined') {

            this.clearToken();
            localStorage.setItem('authToken', token.getToken());
            localStorage.setItem('refreshToken', token.getRefreshToken());
            localStorage.setItem('user', token.getUserName() || '');

            // Extraer y guardar información adicional del token
            const userInfo = token.getUserInfo();

            if (userInfo) {
                localStorage.setItem('userId', userInfo.userId || '');
                localStorage.setItem('roleId', userInfo.roleId || '');
            }

            // Si el token tiene información de rol adicional, guardarla
            if (token.getRoleName()) {
                localStorage.setItem('roleName', token.getRoleName());
            }
        }
    }

    clearToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('roleId');
            localStorage.removeItem('roleName');
        }
    }

    getToken() {
        if (localStorage.getItem('authToken') === null || localStorage.getItem('refreshToken') === null) {
            return null;
        }

        // Usar el método fromStorage del Token que maneja automáticamente la decodificación
        return Token.fromStorage();
    }

    /**
     * Verifica si el usuario actual está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = this.getToken();
        return token && token.isValid();
    }

    /**
     * Obtiene información del usuario actual
     * @returns {Object|null}
     */
    getCurrentUser() {
        const token = this.getToken();
        if (!token || !token.isValid()) {
            return null;
        }

        return token.getUserInfo();
    }

    /**
     * Verifica si el token necesita ser renovado pronto
     * @param {number} warningMinutes - Minutos de antelación para la advertencia
     * @returns {boolean}
     */
    shouldRefreshToken(warningMinutes = 5) {
        const token = this.getToken();
        return token ? token.isExpiringSoon(warningMinutes) : false;
    }
}

export default AuthService;