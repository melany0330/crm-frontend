import AuthService from "../../service/auth/AuthService";

class APIUtil {

    static validateSession() {
        const authService = new AuthService();
        const token = authService.getToken();

        if (!token || !token.getToken()) {
            return false;
        }
        return true;
    }

    static redirectIfNotAuthenticated(nativate) {
        nativate('/account', { replace: true });
    }

    static redirectIfAuthenticated(nativate) {
        nativate('/dashboard', { replace: true });
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
}

export default APIUtil;