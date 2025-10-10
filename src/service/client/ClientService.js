import ServerService from "../../core/service/ServerService";

class ClientService {
  constructor() {
    this.serverService = new ServerService();
  }

  registerClient(client) {
    return this.serverService
      .authSend("/api/clients/create", "POST", client)
      .then(res => res.data);
  }

  updateClient(idClient, clientData) {
    return this.serverService
      .authSend(`/api/clients/update/${idClient}`, "PUT", clientData)
      .then(res => res.data);
  }

  listClients() {
    return this.serverService
      .authSend("/api/clients/list", "GET")
      .then((res) => res.data);
  }

  getClientById(idClient) {
    return this.serverService
      .authSend(`/api/clients/listById/${idClient}`, "GET")
      .then(res => res.data);
  }

  getClientByNit(nit) {
    return this.serverService
      .authSend(`/api/clients/ByNit/${nit}`, "GET")
      .then((res) => res.data)
      .catch(() => null);
  }
}

export default new ClientService();
