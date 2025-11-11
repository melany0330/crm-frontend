
import JWTUtil from '../../core/system/JWTUtil.js';

class Token {

    constructor(token, refreshToken, userName = null, userId = null, roleId = null, roleName = null) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userName = userName;
        this.userId = userId;
        this.roleId = roleId;
        this.roleName = roleName;

        // Si no se proporcionaron los datos del usuario/rol, intentar extraerlos del token
        if (token && (!userId || !roleId || !userName)) {
            this._extractUserInfoFromToken();
        }
    }

    /**
     * Extrae información del usuario del token JWT
     * @private
     */
    _extractUserInfoFromToken() {
        try {
            const decoded = JWTUtil.decodeJWT(this.token);
            if (decoded) {
                const beforeExtraction = {
                    userId: this.userId,
                    userName: this.userName,
                    roleId: this.roleId
                };

                this.userId = this.userId || decoded.userId;
                this.userName = this.userName || decoded.username;
                this.roleId = this.roleId || decoded.roleId;
            }
        } catch (error) {
            console.warn('⚠️ [Token] No se pudo extraer información del token:', error);
        }
    }

    getToken() {
        return this.token;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getUserName() {
        return this.userName;
    }

    getUserId() {
        return this.userId;
    }

    getRoleId() {
        return this.roleId;
    }

    getRoleName() {
        return this.roleName;
    }

    /**
     * Verifica si el token es válido y no ha expirado
     * @returns {boolean}
     */
    isValid() {
        return JWTUtil.isTokenValid(this.token);
    }

    /**
     * Verifica si el token está próximo a expirar
     * @param {number} warningMinutes - Minutos antes de la expiración
     * @returns {boolean}
     */
    isExpiringSoon(warningMinutes = 5) {
        return JWTUtil.isTokenExpiringSoon(this.token, warningMinutes);
    }

    /**
     * Obtiene toda la información del usuario decodificada
     * @returns {Object|null}
     */
    getUserInfo() {
        return JWTUtil.decodeJWT(this.token);
    }

    static build(response, userName) {
        if (response && response.data) {
            return new Token(response.data.token, response.data.refreshToken, userName);
        }
        throw new Error('Invalid response for token creation');
    }

    /**
     * Crea un token desde los datos almacenados en localStorage
     * @returns {Token|null}
     */
    static fromStorage() {
        const token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userName = localStorage.getItem('user');
        const roleId = localStorage.getItem('roleId');
        const roleName = localStorage.getItem('roleName');
        const userId = localStorage.getItem('userId');

        console.log('📦 [Token] Cargando desde localStorage:', {
            hasToken: !!token,
            hasRefreshToken: !!refreshToken,
            userName,
            userId,
            roleId,
            roleName
        });

        if (!token || !refreshToken) {
            console.warn('⚠️ [Token] No se encontró token o refreshToken en localStorage');
            return null;
        }

        const tokenInstance = new Token(token, refreshToken, userName, userId, roleId, roleName);
        console.log('✅ [Token] Token creado desde localStorage:', {
            userId: tokenInstance.getUserId(),
            userName: tokenInstance.getUserName(),
            roleId: tokenInstance.getRoleId(),
            roleName: tokenInstance.getRoleName()
        });

        return tokenInstance;
    }
}

export default Token;