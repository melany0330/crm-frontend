import ServerService from "../../core/service/ServerService";

export default class InventoryService {
    constructor() {
        this.api = new ServerService();
        this.baseUrl = "/api/inventory";
    }

    listInventory() {
        return this.api.authSend(`${this.baseUrl}/list`, 'GET');
    }
};