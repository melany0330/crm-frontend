// src/service/crm/reports.service.js
import ServerService from "../../core/service/ServerService";

class ReportsService {
  ss = new ServerService();

  salesByDate(dto) {
    return this.ss.authSend("/api/reports/salesByDate", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }

  purchasesByDate(dto) {
    return this.ss.authSend("/api/reports/purchasesByDate", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }

  topProducts(dto) {
    return this.ss.authSend("/api/reports/topProducts", "POST", dto)
      .then(r => r.data?.data ?? r.data);
  }
}

export default new ReportsService();
