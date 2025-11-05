// src/service/crm/CRMService.js
import ServerService from "../../core/service/ServerService";

class CRMService {
  ss = new ServerService();

  // ---- Clients -------------------------------------------------------------
  listClients() {
    // Tu endpoint actual
    return this.ss.authSend("/api/clients/list", "GET").then((r) => r.data?.data ?? r.data);
  }

  // ---- Activities (modelo formal) -----------------------------------------
  listActivitiesByClient(idClient) {
    // Tu controller de actividades expone /api/activities/listByClient/{clientId}
    return this.ss
      .authSend(`/api/activities/listByClient/${idClient}`, "GET")
      .then((r) => r.data?.data ?? r.data);
  }

  // ---- Sales (fallback si no hay actividades) ------------------------------
  // Intento 1: ruta REST común si la tienes
  #trySalesByClient_v1(idClient) {
    return this.ss.authSend(`/api/sales/byClient/${idClient}`, "GET").then((r) => r.data?.data ?? r.data);
  }
  // Intento 2: query param, por si tu backend lo soporta
  #trySalesByClient_v2(idClient) {
    return this.ss.authSend(`/api/sales/list?clientId=${idClient}`, "GET").then((r) => r.data?.data ?? r.data);
  }
  // Intento 3: traer todo y filtrar (no ideal si hay muchas ventas)
  async #trySalesByClient_v3(idClient) {
    const all = await this.ss.authSend("/api/sales/list", "GET").then((r) => r.data?.data ?? r.data);
    return Array.isArray(all) ? all.filter((s) => String(s.idClient) === String(idClient)) : [];
  }

  async listSalesByClient(idClient) {
    try {
      const v1 = await this.#trySalesByClient_v1(idClient);
      if (Array.isArray(v1)) return v1;
    } catch (_) {}
    try {
      const v2 = await this.#trySalesByClient_v2(idClient);
      if (Array.isArray(v2)) return v2;
    } catch (_) {}
    // último recurso
    try {
      return await this.#trySalesByClient_v3(idClient);
    } catch (_) {
      return [];
    }
  }
}

export default new CRMService();
