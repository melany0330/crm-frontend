// src/service/crm/sales.service.js
import ServerService from "../../core/service/ServerService";
import ProductsService from "./products.service";

const asArray = (x) => (Array.isArray(x) ? x : []);
const unwrap = (res) => (res?.data?.data ?? res?.data); // ApiResponse {message,data} o data directa

class SalesService {
  constructor() {
    this.server = new ServerService();
  }

  // ---------- LISTAS ----------
  async list() {
    const res = await this.server.authSend("/api/sales/list", "GET");
    const data = unwrap(res);
    return asArray(data);
  }

  /**
   * Ventas por cliente (ruta oficial del backend)
   * GET /api/sales/listByClient/{idClient}
   */
  async listByClient(idClient) {
    const id = Number(idClient);
    const res = await this.server.authSend(`/api/sales/listByClient/${id}`, "GET");
    const data = unwrap(res);
    return asArray(data);
  }

  // ---------- CABECERA ----------
  async getById(idSale) {
    const res = await this.server.authSend(`/api/sales/listById/${idSale}`, "GET");
    return unwrap(res) ?? {};
  }

  // ---------- DETALLES ----------
  /**
   * Normaliza filas de detalle a { name, qty, price, subtotal }
   */
  #normalizeDetailRows(rows, productsMap) {
    const arr = asArray(rows);
  
    return arr.map((it, idx) => {
      // posibles formas en que venga el producto y su id
      const prodObj = it?.product || it?.producto || it?.productDTO || it?.productoDTO;
      const idProducto =
        Number(it?.idProducto ?? it?.productId ?? prodObj?.idProducto ?? prodObj?.idProduct ?? prodObj?.id) || null;
  
      // candidatos de nombre en orden de prioridad
      const name =
        // objeto embebido
        prodObj?.name ||
        prodObj?.nombre ||
        // campos sueltos en el detalle
        it?.nombreProducto ||
        it?.productName ||
        // mapa de productos (por id)
        (idProducto && productsMap?.[idProducto]) ||
        // fallback final
        `Ítem ${idx + 1}`;
  
      const qty =
        Number(it?.cantidad ?? it?.amount ?? it?.qty ?? it?.quantity) || 0;
  
      const price =
        Number(it?.precioUnitario ?? it?.unitPrice ?? it?.price ?? it?.precio) || 0;
  
      const subtotal =
        Number(it?.subtotal ?? it?.totalLinea ?? it?.total) || qty * price;
  
      return { name, qty, price, subtotal };
    });
  }

  /**
   * Obtiene y normaliza el detalle de una venta:
   *  - Prioriza lo embebido en GET /api/sales/listById/{idSale} (SaleDto.details)
   *  - (Opcional) intenta endpoints /api/saleDetails/listBySale si existieran
   */
  async getDetailsNormalized(idSale) {
    // 1) Intentar detalle embebido
    const payload = await this.getById(idSale);
    let rows =
      payload?.details ||
      payload?.detalle ||
      payload?.detalles ||
      payload?.items;

    // 2) (Opcional) si no hay detalle embebido, intenta endpoints de detalle
    if (!rows || !rows.length) {
      const candidates = [
        `/api/saleDetails/listBySale/${idSale}`,
        `/api/saledetails/listBySale/${idSale}`,
        `/api/sales/detail/${idSale}`,
        `/api/sales/detailsBySale/${idSale}`,
        `/api/detailsale/listBySale/${idSale}`,
      ];
      for (const url of candidates) {
        try {
          const r = await this.server.authSend(url, "GET");
          const data = unwrap(r);
          if (Array.isArray(data) && data.length) {
            rows = data;
            break;
          }
        } catch {
          // probar siguiente
        }
      }
    }

    const productsMap = await ProductsService.getMap();
    return this.#normalizeDetailRows(rows || [], productsMap);
  }
}

export default new SalesService();
