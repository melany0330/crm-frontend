import ServerService from "../../core/service/ServerService";

class OffersService {
  ss = new ServerService();

  list() {
    return this.ss.authSend("/api/discounts/listAll", "GET").then((r) => r.data?.data ?? r.data ?? []);
  }

  create(dto) {
    return this.ss.authSend("/api/discounts/create", "POST", dto).then((r) => r.data?.data ?? r.data);
  }

  update(id, dto) {
    return this.ss.authSend(`/api/discounts/update/${id}`, "PUT", dto).then((r) => r.data?.data ?? r.data);
  }

  deactivate(id) {
    return this.ss.authSend(`/api/discounts/deactivate/${id}`, "PUT").then((r) => r.data?.data ?? r.data);
  }
}

export default new OffersService();
