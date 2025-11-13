// src/service/crm/opportunities.service.js
import ServerService from "../../core/service/ServerService";

class OpportunitiesService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/opportunities/list", "GET")
      .then(r => r.data?.data ?? r.data);
  }

  listByClient(idClient) {
    return this.ss.authSend(`/api/opportunities/listByClient/${idClient}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  listByStatus(status) {
    return this.ss.authSend(`/api/opportunities/listByStatus/${status}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  getById(idOpportunity) {
    return this.ss.authSend(`/api/opportunities/listById/${idOpportunity}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  create(dto) {
    return this.ss.authSend("/api/opportunities/create", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }

  update(idOpportunity, dto) {
    return this.ss.authSend(`/api/opportunities/update/${idOpportunity}`, "PUT", dto)
      .then(r => r.data?.data ?? r.data);
  }

  changeStatus(idOpportunity, statusDto) {
    return this.ss.authSend(`/api/opportunities/updateStatus/${idOpportunity}`, "PUT", statusDto)
      .then(r => r.data?.data ?? r.data);
  }

  suggestions() {
    return this.ss.authSend("/api/opportunities/suggestions", "GET")
      .then(r => r.data?.data ?? r.data);
  }

  deactivate(idOpportunity) {
    return this.ss.authSend(`/api/opportunities/deactivate/${idOpportunity}`, "PUT")
      .then(r => r.data?.data ?? r.data);
  }
}

export default new OpportunitiesService();
