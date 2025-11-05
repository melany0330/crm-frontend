// src/pages/crm/ClientsCRM.jsx
import React, { useEffect, useMemo, useState } from "react";
import ClientsService from "../../service/crm/clients.service.js";
import ActivitiesService from "../../service/crm/activities.service.js";
import SalesService from "../../service/crm/sales.service.js";
import QuotesService from "../../service/crm/quotes.service.js";
import { getAuthToken } from "../../core/service/ServerService.js";

const v = (o, list) => list.map((k) => o?.[k]).find((x) => x !== undefined && x !== null);
const fmt = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  return isNaN(d) ? String(s) : d.toLocaleString("es-GT", { hour12: false });
};
const asArray = (x) => (Array.isArray(x) ? x : []);

export default function ClientsCRM() {
  // Izquierda
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  // Derecha datasets
  const [acts, setActs] = useState([]);
  const [sales, setSales] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [expandedQuotes, setExpandedQuotes] = useState(new Set());
  const [quoteDetails, setQuoteDetails] = useState({});

  // Detalle de ventas
  const [expandedSales, setExpandedSales] = useState(new Set());
  const [saleDetails, setSaleDetails] = useState({}); // { [idSale]: [items] }

  // Loading & errors
  const [loading, setLoading] = useState({
    acts: false,
    sales: false,
    quotes: false,
    saleDetail: {},
    quoteDetail: {},
  });
  const [errors, setErrors] = useState({
    acts: "",
    sales: "",
    quotes: "",
    saleDetail: {},
    quoteDetail: {},
  });

  // Tabs
  const [tab, setTab] = useState("datos");

  // Clientes
  useEffect(() => {
    ClientsService.list()
      .then((r) => setRows(Array.isArray(r) ? r : []))
      .catch(() => setRows([]));
  }, []);

  // Filtro
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) => {
      const nit = String(v(c, ["nit", "nitCliente"]) ?? "").toLowerCase();
      const name = [v(c, ["name", "nombre", "nombreCliente"]), v(c, ["lastName", "apellidoCliente"])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const email = String(v(c, ["email", "correo", "correoCliente"]) ?? "").toLowerCase();
      return nit.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [rows, query]);

  // Id cliente
  const selectedId = useMemo(() => {
    if (!selected) return null;
    const idNum = Number(v(selected, ["clientId", "idClient", "idCliente", "id"]));
    return Number.isFinite(idNum) ? idNum : null;
  }, [selected]);

  // Auth guard
  const requireAuth = () => {
    const t = getAuthToken();
    if (!t) throw new Error("No hay sesión activa. Inicie sesión para ver la información del cliente.");
  };

  // ===== Cargas =====
  const loadActivities = async (idClient) => {
    setLoading((s) => ({ ...s, acts: true }));
    setErrors((e) => ({ ...e, acts: "" }));
    try {
      requireAuth();
      const r = await ActivitiesService.listByClient(idClient);
      setActs(asArray(r));
    } catch (e) {
      setErrors((er) => ({
        ...er,
        acts:
          e?.response?.status === 403
            ? "No autorizado para ver actividades."
            : e?.response?.data?.message || e?.message || "Error al cargar actividades",
      }));
      setActs([]);
    } finally {
      setLoading((s) => ({ ...s, acts: false }));
    }
  };

  const loadSales = async (idClient) => {
    setLoading((s) => ({ ...s, sales: true }));
    setErrors((e) => ({ ...e, sales: "" }));
    try {
      requireAuth();
      const r = await SalesService.listByClient(idClient, {
        nit: v(selected, ["nit", "nitCliente"]),
        email: v(selected, ["email", "correo", "correoCliente"]),
      });
      setSales(asArray(r));
    } catch (e) {
      const status = e?.response?.status;
      const endpoint = e?.__endpoint || e?.config?.url || "ventas";
      const msg =
        status === 403
          ? `No autorizado para consultar ${endpoint}. Revisa roles/permisos del usuario.`
          : e?.response?.data?.message || e?.message || "Error al cargar compras";
      setErrors((er) => ({ ...er, sales: msg }));
      setSales([]);
    } finally {
      setLoading((s) => ({ ...s, sales: false }));
    }
  };

  const loadQuotes = async (idClient) => {
    setLoading((s) => ({ ...s, quotes: true }));
    setErrors((e) => ({ ...e, quotes: "" }));
    try {
      requireAuth();
      const r = await QuotesService.listByClient(idClient);
      setQuotes(asArray(r));
    } catch (e) {
      setErrors((er) => ({
        ...er,
        quotes:
          e?.response?.status === 403
            ? "No autorizado para ver cotizaciones."
            : e?.response?.data?.message || e?.message || "Error al cargar cotizaciones",
      }));
      setQuotes([]);
    } finally {
      setLoading((s) => ({ ...s, quotes: false }));
    }
  };

  const loadAllForClient = async (idClient) => {
    await Promise.allSettled([loadSales(idClient), loadQuotes(idClient), loadActivities(idClient)]);
    setExpandedSales(new Set());
    setSaleDetails({});
    setExpandedQuotes(new Set());
    setQuoteDetails({});
  };

  // Cambio de cliente
  useEffect(() => {
    if (!selectedId) {
      setActs([]);
      setSales([]);
      setQuotes([]);
      setExpandedSales(new Set());
      setSaleDetails({});
      return;
    }
    setTab("datos");
    loadAllForClient(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // ===== Toggles de detalle =====

  // Ventas
  const toggleSaleDetail = async (saleRow) => {
    const idSale = Number(v(saleRow, ["idVenta", "idSale", "id"]));
    if (!idSale) return;

    const next = new Set(expandedSales);
    const isOpen = next.has(idSale);

    if (isOpen) {
      next.delete(idSale);
      setExpandedSales(next);
      return;
    }

    if (!saleDetails[idSale]) {
      setLoading((s) => ({ ...s, saleDetail: { ...s.saleDetail, [idSale]: true } }));
      setErrors((e) => ({ ...e, saleDetail: { ...e.saleDetail, [idSale]: "" } }));
      try {
        requireAuth();
        const items = await SalesService.getDetailsNormalized(idSale);
        setSaleDetails((m) => ({ ...m, [idSale]: items }));
      } catch (e) {
        setErrors((er) => ({
          ...er,
          saleDetail: {
            ...(er.saleDetail || {}),
            [idSale]:
              e?.response?.status === 403
                ? "No autorizado para ver el detalle de esta venta."
                : e?.response?.data?.message || e?.message || "Error al cargar detalle de la venta",
          },
        }));
        setSaleDetails((m) => ({ ...m, [idSale]: [] }));
      } finally {
        setLoading((s) => ({ ...s, saleDetail: { ...s.saleDetail, [idSale]: false } }));
      }
    }

    next.add(idSale);
    setExpandedSales(next);
  };

  // Cotizaciones
  const toggleQuoteDetail = async (quoteRow) => {
    const idQuote = Number(v(quoteRow, ["idQuote", "idCotizacion", "id"]));
    if (!idQuote) return;

    const next = new Set(expandedQuotes);
    const isOpen = next.has(idQuote);

    if (isOpen) {
      next.delete(idQuote);
      setExpandedQuotes(next);
      return;
    }

    if (!quoteDetails[idQuote]) {
      setLoading((s) => ({ ...s, quoteDetail: { ...s.quoteDetail, [idQuote]: true } }));
      setErrors((e) => ({ ...e, quoteDetail: { ...(e.quoteDetail || {}), [idQuote]: "" } }));
      try {
        requireAuth();
        const items = await QuotesService.getDetailsNormalized(idQuote);
        setQuoteDetails((m) => ({ ...m, [idQuote]: items }));
      } catch (e) {
        setErrors((er) => ({
          ...er,
          quoteDetail: {
            ...(er.quoteDetail || {}),
            [idQuote]:
              e?.response?.status === 403
                ? "No autorizado para ver el detalle de esta cotización."
                : e?.response?.data?.message || e?.message || "Error al cargar detalle de la cotización",
          },
        }));
        setQuoteDetails((m) => ({ ...m, [idQuote]: [] }));
      } finally {
        setLoading((s) => ({ ...s, quoteDetail: { ...s.quoteDetail, [idQuote]: false } }));
      }
    }

    next.add(idQuote);
    setExpandedQuotes(next);
  };

  const money = (n) =>
    typeof n === "number" && Number.isFinite(n) ? n.toFixed(2) : n ?? "-";

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1.6fr", alignItems: "start" }}>
      {/* Izquierda: clientes */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Clientes</h3>
          <input
            placeholder="Buscar por NIT, nombre o correo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <table className="table" style={{ width: "100%", margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 120 }}>NIT</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    No hay clientes.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const id = v(c, ["clientId", "idClient", "idCliente", "id"]);
                  const nit = v(c, ["nit", "nitCliente"]);
                  const nombre = [v(c, ["name", "nombre", "nombreCliente"]), v(c, ["lastName", "apellidoCliente"])]
                    .filter(Boolean)
                    .join(" ");
                  const email = v(c, ["email", "correo", "correoCliente"]);
                  const sel = selected && Number(id) === Number(v(selected, ["clientId", "idClient", "idCliente", "id"]));
                  return (
                    <tr
                      key={id ?? nit}
                      onClick={() => setSelected(c)}
                      style={{ cursor: "pointer", background: sel ? "#eef6ff" : "" }}
                    >
                      <td>{nit || "-"}</td>
                      <td>{nombre || "-"}</td>
                      <td>{email || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Derecha */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>
            Cliente{" "}
            {selected
              ? `· NIT: ${v(selected, ["nit", "nitCliente"]) || "-"} · Correo: ${
                  v(selected, ["email", "correo", "correoCliente"]) || "-"
                }`
              : ""}
          </h3>
        </div>

        {selectedId && (
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={() => loadAllForClient(selectedId)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb" }}
            >
              Refrescar
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {["datos", "compras", "cotizaciones", "actividades"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: tab === t ? "1px solid #111" : "1px solid #e5e7eb",
                background: tab === t ? "#111" : "#fff",
                color: tab === t ? "#fff" : "#111",
                cursor: "pointer",
              }}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Datos */}
        {tab === "datos" && selected && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            <div>
              <b>NIT:</b> {v(selected, ["nit", "nitCliente"]) || "-"}
            </div>
            <div>
              <b>Nombre:</b>{" "}
              {[v(selected, ["name", "nombre", "nombreCliente"]), v(selected, ["lastName", "apellidoCliente"])]
                .filter(Boolean)
                .join(" ") || "-"}
            </div>
            <div>
              <b>Correo:</b> {v(selected, ["email", "correo", "correoCliente"]) || "-"}
            </div>
            <div>
              <b>Teléfono:</b> {v(selected, ["phone", "telefonoCliente"]) || "-"}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <b>Dirección:</b> {v(selected, ["address", "direccionCliente"]) || "-"}
            </div>
          </div>
        )}

        {/* Compras */}
        {tab === "compras" && (
          <section style={{ marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 8px" }}>
              Historial de compras {sales.length ? `(${sales.length})` : ""}
            </h4>
            {errors.sales && <p style={{ color: "crimson" }}>{errors.sales}</p>}
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th style={{ width: 150, textAlign: "right" }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {loading.sales ? (
                  <tr>
                    <td colSpan={4}>Cargando…</td>
                  </tr>
                ) : sales.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      Sin compras.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => {
                    const idSale = Number(v(s, ["idVenta", "idSale", "id"]));
                    const isOpen = expandedSales.has(idSale);
                    const detailErr = errors.saleDetail[idSale];
                    const detailLoading = !!loading.saleDetail[idSale];
                    const items = saleDetails[idSale] || [];
                    return (
                      <React.Fragment key={idSale}>
                        <tr>
                          <td>{fmt(v(s, ["fechaVenta", "saleDate", "createdAt"]))}</td>
                          <td>{money(v(s, ["total"]))}</td>
                          <td>{Number(v(s, ["estado", "status"])) === 1 ? "Activa" : "Inactiva"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => toggleSaleDetail(s)}
                              disabled={detailLoading}
                            >
                              {isOpen ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr>
                            <td colSpan={4} style={{ background: "#fafafa" }}>
                              {detailErr && (
                                <div style={{ color: "crimson", marginBottom: 8 }}>{detailErr}</div>
                              )}
                              {detailLoading ? (
                                <div>Cargando detalle…</div>
                              ) : items.length === 0 ? (
                                <div>No hay ítems para esta venta.</div>
                              ) : (
                                <table className="table" style={{ width: "100%", marginTop: 8 }}>
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th style={{ width: 120 }}>Cantidad</th>
                                      <th style={{ width: 140 }}>Precio</th>
                                      <th style={{ width: 140 }}>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items.map((it, idx) => (
                                      <tr key={idx}>
                                        <td>{it.name}</td>
                                        <td>{it.qty}</td>
                                        <td>{money(it.price)}</td>
                                        <td>{money(it.subtotal)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Cotizaciones */}
        {tab === "cotizaciones" && (
          <section style={{ marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 8px" }}>
              Cotizaciones {quotes.length ? `(${quotes.length})` : ""}
            </h4>
            {errors.quotes && <p style={{ color: "crimson" }}>{errors.quotes}</p>}
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th style={{ width: 150, textAlign: "right" }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {loading.quotes ? (
                  <tr>
                    <td colSpan={4}>Cargando…</td>
                  </tr>
                ) : quotes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      Sin cotizaciones.
                    </td>
                  </tr>
                ) : (
                  quotes.map((q) => {
                    const idQuote = Number(v(q, ["idQuote", "idCotizacion", "id"]));
                    const isOpen = expandedQuotes.has(idQuote);
                    const detailErr = errors.quoteDetail[idQuote];
                    const detailLoading = !!loading.quoteDetail[idQuote];
                    const items = quoteDetails[idQuote] || [];
                    return (
                      <React.Fragment key={idQuote}>
                        <tr>
                          <td>{fmt(v(q, ["quoteDate", "fechaCotizacion", "createdAt"]))}</td>
                          <td>{money(v(q, ["total"]))}</td>
                          <td>{v(q, ["status", "estado"]) ?? "-"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => toggleQuoteDetail(q)}
                              disabled={detailLoading}
                            >
                              {isOpen ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr>
                            <td colSpan={4} style={{ background: "#fafafa" }}>
                              {detailErr && (
                                <div style={{ color: "crimson", marginBottom: 8 }}>{detailErr}</div>
                              )}
                              {detailLoading ? (
                                <div>Cargando detalle…</div>
                              ) : items.length === 0 ? (
                                <div>No hay ítems para esta cotización.</div>
                              ) : (
                                <table className="table" style={{ width: "100%", marginTop: 8 }}>
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th style={{ width: 120 }}>Cantidad</th>
                                      <th style={{ width: 140 }}>Precio</th>
                                      <th style={{ width: 140 }}>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items.map((it, idx) => (
                                      <tr key={idx}>
                                        <td>{it.name}</td>
                                        <td>{it.qty}</td>
                                        <td>{money(it.price)}</td>
                                        <td>{money(it.subtotal)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Actividades */}
        {tab === "actividades" && (
          <section>
            <h4 style={{ margin: "0 0 8px" }}>
              Actividades {acts.length ? `(${acts.length})` : ""}
            </h4>
            {errors.acts && <p style={{ color: "crimson" }}>{errors.acts}</p>}
            <ul style={{ marginTop: 6 }}>
              {loading.acts ? (
                <li>Cargando…</li>
              ) : acts.length === 0 ? (
                <li>Sin actividades registradas.</li>
              ) : (
                acts.map((a) => {
                  const id = v(a, ["idActivity", "idActividad", "id"]);
                  const tipo = v(a, ["activityType", "type", "tipo", "tipoActividad"]) || "Actividad";
                  const desc = v(a, ["description", "title", "asunto", "descripcion"]) || "-";
                  const fecha = v(a, ["activityDate", "date", "fecha", "fechaActividad", "createdAt"]);
                  return (
                    <li key={id} style={{ padding: "6px 0", borderBottom: "1px dashed #e5e7eb" }}>
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "#eef2ff",
                          color: "#111827",
                          border: "1px solid #e5e7eb",
                          marginRight: 8,
                        }}
                      >
                        {tipo}
                      </span>
                      <b>{desc}</b> <span style={{ color: "#64748b" }}>({fmt(fecha)})</span>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
