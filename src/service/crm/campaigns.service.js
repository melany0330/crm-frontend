// src/service/crm/campaigns.service.js
import ServerService from "../../core/service/ServerService";

class CampaignsService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/campaigns/list", "GET")
      .then(r => r.data?.data ?? r.data);
  }

  getById(idCampaign) {
    return this.ss.authSend(`/api/campaigns/listById/${idCampaign}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  create(dto) {
    return this.ss.authSend("/api/campaigns/create", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }

  update(idCampaign, dto) {
    return this.ss.authSend(`/api/campaigns/update/${idCampaign}`, "PUT", dto)
      .then(r => r.data?.data ?? r.data);
  }

  deactivate(idCampaign) {
    return this.ss.authSend(`/api/campaigns/deactivate/${idCampaign}`, "PUT")
      .then(r => r.data?.data ?? r.data);
  }
}

export default new CampaignsService();
