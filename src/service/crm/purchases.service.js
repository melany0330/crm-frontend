// src/service/crm/purchases.service.js
import ServerService from "../../core/service/ServerService";

class PurchasesService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/purchases/list", "GET")
      .then(r => r.data?.data ?? r.data);
  }

  getById(idPurchase) {
    return this.ss.authSend(`/api/purchases/listById/${idPurchase}`, "GET")
      .then(r => r.data?.data ?? r.data);
  }

  // purchaseDto: { purchaseDate, total, providerId, details:[{idProduct,amount,unitPrice}] }
  create(purchaseDto) {
    return this.ss.authSend("/api/purchases/create", "POST", purchaseDto)
      .then(r => r.data?.data ?? r.data);
  }

  deactivate(idPurchase) {
    return this.ss.authSend(`/api/purchases/deactivate/${idPurchase}`, "PUT")
      .then(r => r.data?.data ?? r.data);
  }

  reportByDates(dateRangeDto) {
    return this.ss.authSend("/api/purchases/reportByDates", "POST", dateRangeDto)
      .then(r => r.data?.data ?? r.data);
  }
}

export default new PurchasesService();
