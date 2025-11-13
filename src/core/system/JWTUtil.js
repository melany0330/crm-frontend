/**
 * Utilidad para manejar tokens JWT
 * Decodifica tokens y extrae información del usuario y rol
 */
class JWTUtil {
    /**
     * Decodifica un token JWT y extrae la información del payload
     * @param {string} token - Token JWT a decodificar
     * @returns {Object|null} Información decodificada del token o null si es inválido
     */
    static decodeJWT(token) {
        try {
            if (!token || typeof token !== 'string') {
                console.warn('Token inválido o no proporcionado');
                return null;
            }

            // Verificar que el token tenga el formato correcto (3 partes separadas por puntos)
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.warn('Token JWT no tiene el formato correcto');
                return null;
            }

            // Decodificar el payload (segunda parte del token)
            const payload = JSON.parse(atob(parts[1]));

            // Verificar que el token no haya expirado
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
                console.warn('Token JWT ha expirado');
                return null;
            }

            // El ID del rol está en formato binario en el claim "ri"
            const roleIdBinary = payload.ri;
            const roleId = roleIdBinary ? parseInt(roleIdBinary, 2) : null; // Convertir de binario a decimal

            return {
                userId: payload.jti ? parseInt(payload.jti, 2) : null, // ID del usuario también en binario
                username: payload.sub || null,
                roleId: roleId,
                exp: payload.exp,
                iat: payload.iat,
                raw: payload // Payload completo por si se necesita acceder a otros claims
            };
        } catch (error) {
            console.error('Error decodificando JWT:', error);
            return null;
        }
    }

    /**
     * Verifica si un token es válido y no ha expirado
     * @param {string} token - Token JWT a verificar
     * @returns {boolean} True si el token es válido
     */
    static isTokenValid(token) {
        const decoded = this.decodeJWT(token);
        return decoded !== null;
    }

    /**
     * Obtiene el tiempo restante antes de que expire el token
     * @param {string} token - Token JWT
     * @returns {number} Segundos restantes antes de la expiración, o 0 si ya expiró
     */
    static getTimeToExpiration(token) {
        const decoded = this.decodeJWT(token);
        if (!decoded || !decoded.exp) return 0;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - currentTime;
        return Math.max(0, timeLeft);
    }

    /**
     * Verifica si el token está próximo a expirar
     * @param {string} token - Token JWT
     * @param {number} warningMinutes - Minutos antes de la expiración para considerar "próximo a expirar"
     * @returns {boolean} True si el token expira pronto
     */
    static isTokenExpiringSoon(token, warningMinutes = 5) {
        const timeLeft = this.getTimeToExpiration(token);
        return timeLeft > 0 && timeLeft <= (warningMinutes * 60);
    }
}

export default JWTUtil;