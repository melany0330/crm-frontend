import ServerService from "../../core/service/ServerService";

class DiscountService {
  constructor() {
    this.serverService = new ServerService();
  }

  registerDiscount(discount) {
    return this.serverService.authSend("/api/discounts/create", "POST", discount);
  }

  updateDiscount(idDescuento, discountData) {
    return this.serverService.authSend(`/api/discounts/update/${idDescuento}`, "PUT", discountData);
  }

  listDiscounts() {
    
    return this.serverService
      .authSend("/api/discounts/list", "GET")
      .then((res) => res.data);
  }

  listAllDiscounts() {
    
    return this.serverService
      .authSend("/api/discounts/listAll", "GET")
      .then((res) => res.data);
  }

  getDiscountById(idDescuento) {
    return this.serverService.authSend(`/api/discounts/${idDescuento}`, "GET");
  }
}

export default new DiscountService();
