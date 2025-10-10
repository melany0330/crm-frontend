import ServerService from "../../core/service/ServerService";

export default class RoleService {
    constructor() {
        this.api = new ServerService();
        this.baseUrl = "/api/role";
    }

    listRoles() {
        return this.api.authSend(`${this.baseUrl}/list`, 'GET');
    }

    createRole(data) {
        return this.api.authSend(`${this.baseUrl}/create`, 'POST', data);
    }

    updateRole(id, data) {
        return this.api.authSend(`${this.baseUrl}/update/${id}`, 'PUT', data);
    }

    deleteRole(id) {
        return this.api.authSend(`${this.baseUrl}/deactivate/${id}`, 'DELETE');
    }
};