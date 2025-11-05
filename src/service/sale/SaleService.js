// src/service/sale/SaleService.js
import ServerService from '../../core/service/ServerService';

class SaleService {
  constructor() {
    this.serverService = new ServerService();
  }

  listAll() {
    return this.serverService
      .authSend('/api/sales/list', 'GET')
      .then(res => res.data);
  }

  getById(idSale) {
    return this.serverService
      .authSend(`/api/sales/listById/${idSale}`, 'GET')
      .then(res => res.data);
  }

  create(saleDto) {
    // Devuelve directamente res.data
    return this.serverService
      .authSend('/api/sales/create', 'POST', saleDto)
      .then(res => res.data);
  }

  deactivate(idSale) {
    return this.serverService
      .authSend(`/api/sales/deactivate/${idSale}`, 'PUT')
      .then(res => res.data);
  }

  reportByDate(dateRangeDto) {
    return this.serverService
      .authSend('/api/sales/reportByDate', 'POST', dateRangeDto)
      .then(res => res.data);
  }
}

export default new SaleService();
