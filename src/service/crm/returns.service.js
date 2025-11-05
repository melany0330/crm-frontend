// src/service/crm/returns.service.js
import ServerService from "../../core/service/ServerService";

const toArray = (x) => {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.data)) return x.data;
  if (x && Array.isArray(x.items)) return x.items;
  return [];
};

class ReturnsService {
  constructor() {
    this.server = new ServerService();
  }

  async list() {
    const res = await this.server.authSend("/api/returns/list", "GET");
    return toArray(res?.data ?? res);
  }

  // Si tu backend NO tiene listByClient, filtramos localmente.
  // Si /returns/list devuelve 403 por permisos, propagamos para que la UI muestre el aviso.
  async listByClient(clientId) {
    const all = await this.list();
    return toArray(all).filter(
      (r) => Number(r?.idCliente ?? r?.clientId ?? r?.idClient ?? r?.clienteId) === Number(clientId)
    );
  }
}

export default new ReturnsService();
