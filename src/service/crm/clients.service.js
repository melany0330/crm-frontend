// src/service/crm/clients.service.js
import ServerService from "../../core/service/ServerService";

class ClientsService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/clients/list", "GET")
      .then(r => r.data?.data ?? r.data);
  }

  getById(idClient) {
    return this.ss.authSend(`/api/clients/listById/${idClient}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  create(dto) {
    return this.ss.authSend("/api/clients/create", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }

  update(idClient, dto) {
    return this.ss.authSend(`/api/clients/update/${idClient}`, "PUT", dto)
      .then(r => r.data?.data ?? r.data);
  }

  deactivate(idClient) {
    return this.ss.authSend(`/api/clients/deactivate/${idClient}`, "PUT")
      .then(r => r.data?.data ?? r.data);
  }
}

export default new ClientsService();
