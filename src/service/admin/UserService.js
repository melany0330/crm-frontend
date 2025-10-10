import ServerService from "../../core/service/ServerService";

export default class UserService {
    constructor() {
        this.api = new ServerService();
        this.baseUrl = "/api/user";
    }

    listUsers() {
        return this.api.authSend(`${this.baseUrl}/list`, 'GET');
    }

    createUser(data) {
        return this.api.authSend('/api/auth/register', 'POST', data);
    }

    updateUser(id, data) {
        return this.api.authSend(`${this.baseUrl}/update/${id}`, 'PUT', data);
    }

    deleteUser(id) {
        return this.api.authSend(`${this.baseUrl}/deactivate/${id}`, 'DELETE');
    }
}