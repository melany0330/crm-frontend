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
        return this.serverService.send(`${process.env.VITE_WMS_API_AUTH}/login`, 'POST', null, data);
    }

    logout() {
        const token = this.getToken();
        return this.serverService.authSend(`${process.env.VITE_WMS_API_AUTH}/logout`, 'POST');
    }

    saveToken(token) {
        if (typeof window !== 'undefined') {
            this.clearToken();
            localStorage.setItem('authToken', token.getToken());
            localStorage.setItem('refreshToken', token.getRefreshToken());
            localStorage.setItem('user', token.getUserName());
        }
    }

    clearToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    getToken() {
        if (localStorage.getItem('authToken') === null || localStorage.getItem('refreshToken') === null) {
            return null;
        }
        const token = new Token(
            localStorage.getItem('authToken'),
            localStorage.getItem('refreshToken'),
            localStorage.getItem('user')
        );
        return token;
    }
}

export default AuthService;