import ServerService from "../../core/service/ServerService";

export default class MovementService {
    constructor() {
        this.apiUrl = '/api/transaction';
        this.api = new ServerService();
    }

    listMovements() {
        return this.api.authSend(`${this.apiUrl}/list`, 'GET');
    }
    
    updateMovement(id, data) {
        return this.api.authSend(`${this.apiUrl}/update/${id}`, 'PUT', data);
    }
}