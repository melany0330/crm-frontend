// src/service/crm/quotes.service.js
import ServerService from "../../core/service/ServerService";
import ProductsService from "./products.service";

const asArray = (x) => (Array.isArray(x) ? x : []);
const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

class QuotesService {
  constructor() {
    this.server = new ServerService();
  }

  // -------- LISTADOS --------
  async list() {
    const res = await this.server.authSend("/api/quotes/list", "GET");
    return asArray(unwrap(res));
  }

  async listByClient(idClient) {
    const id = Number(idClient);
    const res = await this.server.authSend(`/api/quotes/listByClient/${id}`, "GET");
    return asArray(unwrap(res));
  }

  async getById(idQuote) {
    const res = await this.server.authSend(`/api/quotes/listById/${idQuote}`, "GET");
    return unwrap(res) ?? {};
  }

  async create(dto) {
    const res = await this.server.authSend("/api/quotes/create", "POST", dto);
    return unwrap(res);
  }

  async update(idQuote, dto) {
    const res = await this.server.authSend(`/api/quotes/update/${idQuote}`, "PUT", dto);
    return unwrap(res);
  }

  async updateStatus(idQuote, status) {
    const payload = { status };
    const res = await this.server.authSend(`/api/quotes/updateStatus/${idQuote}`, "PUT", payload);
    return unwrap(res);
  }

  async deactivate(idQuote) {
    const res = await this.server.authSend(`/api/quotes/deactivate/${idQuote}`, "PUT");
    return unwrap(res);
  }

  async delete(idQuote) {
    return this.deactivate(idQuote);
  }

  // -------- DETALLE --------
  async #tryDetailEndpoints(idQuote) {
    const candidates = [
      `/api/quoteDetails/listByQuote/${idQuote}`,
      `/api/quotedetails/listByQuote/${idQuote}`,
      `/api/quotes/detailsByQuote/${idQuote}`,
      `/api/quotes/detail/${idQuote}`,
      `/api/detallecotizacion/listByQuote/${idQuote}`,
    ];
    for (const url of candidates) {
      try {
        const r = await this.server.authSend(url, "GET");
        const data = unwrap(r);
        if (Array.isArray(data) && data.length) return data;
      } catch {}
    }
    return null;
  }

  async #listAllDetailsAndFilter(idQuote) {
    const candidates = [
      "/api/quoteDetails/list",
      "/api/quotedetails/list",
      "/api/detallecotizacion/list",
    ];
    for (const url of candidates) {
      try {
        const r = await this.server.authSend(url, "GET");
        const arr = asArray(unwrap(r));
        if (arr.length) {
          return arr.filter(
            (d) =>
              Number(d?.idQuote ?? d?.quoteId ?? d?.idCotizacion) === Number(idQuote)
          );
        }
      } catch {}
    }
    return [];
  }

  #normalizeDetailRows(rows, productsMap) {
    const arr = asArray(rows);
    return arr.map((it, idx) => {
      const prodObj = it?.product || it?.producto || it?.productDTO || it?.productoDTO;

      const idProducto =
        Number(
          it?.idProduct ??
            it?.idProducto ??
            it?.productId ??
            prodObj?.idProduct ??
            prodObj?.idProducto ??
            prodObj?.id
        ) || null;

      const name =
        prodObj?.name ||
        prodObj?.nombre ||
        it?.nombreProducto ||
        it?.productName ||
        (idProducto && productsMap?.[idProducto]) ||
        ""; // ojo: dejamos vacío si aún no resuelve

      const qty = Number(it?.quantity ?? it?.cantidad ?? it?.qty) || 0;
      const price =
        Number(it?.unitPrice ?? it?.precioUnitario ?? it?.price ?? it?.precio) || 0;
      const subtotal =
        Number(it?.subtotal ?? it?.totalLinea ?? it?.total) || qty * price;

      return { idProduct: idProducto, name, qty, price, subtotal };
    });
  }

  /**
   * Detalle normalizado con fallback por producto si el nombre sigue vacío.
   */
  async getDetailsNormalized(idQuote) {
    // 1) Detalle embebido
    let rows = null;
    try {
      const q = await this.getById(idQuote);
      rows = q?.details || q?.detalle || q?.detalles || q?.items || null;
    } catch {}

    // 2) Endpoints ad-hoc
    if (!rows || !rows.length) {
      rows = await this.#tryDetailEndpoints(idQuote);
    }

    // 3) Listado+filtro
    if (!rows || !rows.length) {
      rows = await this.#listAllDetailsAndFilter(idQuote);
    }

    const productsMap = await ProductsService.getMap();
    let items = this.#normalizeDetailRows(rows || [], productsMap);

    // === Fallback: intenta pedir el nombre por id individual si aún está vacío ===
    const missing = items.filter((x) => !x.name && x.idProduct);
    if (missing.length) {
      // Pedimos en paralelo; si falla, lo ignoramos
      const byId = await Promise.allSettled(
        missing.map((m) => ProductsService.getById(m.idProduct))
      );
      byId.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value) {
          const p = res.value;
          const name =
            p?.name ?? p?.nombre ?? p?.nombreProducto ?? p?.productName ?? "";
          if (String(name).trim()) {
            const pid = missing[i].idProduct;
            items = items.map((it) =>
              it.idProduct === pid && !it.name
                ? { ...it, name: String(name).trim() }
                : it
            );
          }
        }
      });
    }

    // Relleno final para UI
    items = items.map((it, idx) => ({
      ...it,
      name: it.name || `Ítem ${idx + 1}`,
    }));

    return items;
  }
}

export default new QuotesService();
