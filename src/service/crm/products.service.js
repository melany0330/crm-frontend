// src/service/crm/products.service.js
import ServerService from "../../core/service/ServerService";

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

class ProductsService {
  constructor() {
    this.server = new ServerService();
    this._map = null;     // cache en memoria
    this._ts = 0;         // timestamp para invalidar si quisieras
  }

  /**
   * Devuelve { [idProduct]: nombre }
   * Soporta múltiples variantes de campos que puede devolver el backend.
   */
  async getMap(force = false) {
    // cache simple (1 min por si actualizas catálogos seguido)
    if (!force && this._map && Date.now() - this._ts < 60_000) {
      return this._map;
    }

    try {
      const res = await this.server.authSend("/api/products/list", "GET");
      const data = unwrap(res);
      const arr = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];

      const map = {};
      for (const p of arr) {
        const id =
          Number(
            p?.idProduct ??
            p?.idProducto ??
            p?.productId ??
            p?.id
          );

        const name =
          p?.name ??
          p?.nombre ??
          p?.nombreProducto ??
          p?.productName ??
          "";

        if (Number.isFinite(id) && String(name).trim()) {
          map[id] = String(name).trim();
        }
      }

      this._map = map;
      this._ts = Date.now();
      return this._map;
    } catch {
      // si falla, deja algo definido para no reintentar en caliente
      this._map = {};
      this._ts = Date.now();
      return this._map;
    }
  }

  /**
   * (Opcional) Obtener 1 producto por id si necesitas un fallback puntual
   */
  async getById(id) {
    const res = await this.server.authSend(`/api/products/listById/${id}`, "GET");
    return unwrap(res);
  }
}

export default new ProductsService();
