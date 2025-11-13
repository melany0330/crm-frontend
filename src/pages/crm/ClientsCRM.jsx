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

  const getTabIcon = (tab) => {
    const icons = {
      'datos': 'datos',
      'compras': 'compras',
      'cotizaciones': 'cotizaciones',
      'actividades': 'actividades'
    };
    return icons[tab] || '📋';
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Gestión de Clientes</h2>
        <input
          placeholder="🔍 Buscar por NIT, nombre o correo…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            minWidth: '300px',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{ display: "grid", gap: '2rem', gridTemplateColumns: "1fr 1.6fr", alignItems: "start" }}>
        {/* Izquierda: Lista de clientes */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: "100%", borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', width: '120px' }}>NIT</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: '2rem', color: '#666' }}>
                      No hay clientes registrados
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
                        style={{
                          cursor: "pointer",
                          background: sel ? "#eef6ff" : "transparent",
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!sel) e.target.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          if (!sel) e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: '600' }}>{nit || "-"}</td>
                        <td style={{ padding: '1rem' }}>{nombre || "-"}</td>
                        <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>{email || "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derecha: Detalles del cliente */}
        <div>
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                {selected ? (
                  <>
                    Cliente Seleccionado
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                      NIT: {v(selected, ["nit", "nitCliente"]) || "-"} •
                      Email: {v(selected, ["email", "correo", "correoCliente"]) || "-"}
                    </div>
                  </>
                ) : (
                  "Selecciona un cliente"
                )}
              </h3>
              {selectedId && (
                <button
                  onClick={() => loadAllForClient(selectedId)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Refrescar
                </button>
              )}
            </div>
          </div>

          {selected && (
            <div style={{ display: "flex", gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {["datos", "compras", "cotizaciones", "actividades"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: tab === t ? '#667eea' : 'white',
                    color: tab === t ? 'white' : '#333',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (tab !== t) {
                      e.target.style.background = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tab !== t) {
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  {getTabIcon(t)} {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Datos del cliente */}
          {tab === "datos" && selected && (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>
                Información del Cliente
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: '1.5rem'
              }}>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.25rem' }}>NIT</div>
                  <div style={{ fontSize: '1.1rem' }}>{v(selected, ["nit", "nitCliente"]) || "-"}</div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.25rem' }}>Nombre Completo</div>
                  <div style={{ fontSize: '1.1rem' }}>
                    {[v(selected, ["name", "nombre", "nombreCliente"]), v(selected, ["lastName", "apellidoCliente"])]
                      .filter(Boolean)
                      .join(" ") || "-"}
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.25rem' }}>Correo Electrónico</div>
                  <div style={{ fontSize: '1.1rem' }}>{v(selected, ["email", "correo", "correoCliente"]) || "-"}</div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.25rem' }}>Teléfono</div>
                  <div style={{ fontSize: '1.1rem' }}>{v(selected, ["phone", "telefonoCliente"]) || "-"}</div>
                </div>
                <div style={{ gridColumn: "1 / -1", padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.25rem' }}>Dirección</div>
                  <div style={{ fontSize: '1.1rem' }}>{v(selected, ["address", "direccionCliente"]) || "-"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Compras */}
          {tab === "compras" && (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: '#333', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>
                Historial de Compras {sales.length ? `(${sales.length})` : ""}
              </h4>
              {errors.sales && (
                <div style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  {errors.sales}
                </div>
              )}
              <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: "100%", borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#10b981', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
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
                            <tr style={{
                              transition: 'background-color 0.2s ease',
                              ':hover': { backgroundColor: '#f8f9fa' }
                            }}>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{fmt(v(s, ["fechaVenta", "saleDate", "createdAt"]))}</td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#10b981' }}>{money(v(s, ["total"]))}</td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '12px',
                                  fontSize: '0.875rem',
                                  backgroundColor: Number(v(s, ["estado", "status"])) === 1 ? '#dcfce7' : '#fee2e2',
                                  color: Number(v(s, ["estado", "status"])) === 1 ? '#166534' : '#dc2626'
                                }}>
                                  {Number(v(s, ["estado", "status"])) === 1 ? "Activa" : "Inactiva"}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: "right" }}>
                                <button
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: '1px solid #10b981',
                                    background: 'white',
                                    color: '#10b981',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.background = '#10b981';
                                    e.target.style.color = 'white';
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.color = '#10b981';
                                  }}
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
              </div>
            </div>
          )}

          {/* Cotizaciones */}
          {tab === "cotizaciones" && (
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: '#333', borderBottom: '2px solid #3b82f6', paddingBottom: '0.5rem' }}>
                Cotizaciones {quotes.length ? `(${quotes.length})` : ""}
              </h4>
              {errors.quotes && (
                <div style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  {errors.quotes}
                </div>
              )}
              <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: "100%", borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.quotes ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando…</td>
                      </tr>
                    ) : quotes.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: "center", color: '#6b7280' }}>
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
                            <tr style={{
                              transition: 'background-color 0.2s ease',
                              ':hover': { backgroundColor: '#f8f9fa' }
                            }}>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{fmt(v(q, ["quoteDate", "fechaCotizacion", "createdAt"]))}</td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#3b82f6' }}>{money(v(q, ["total"]))}</td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '12px',
                                  fontSize: '0.875rem',
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af'
                                }}>
                                  {v(q, ["status", "estado"]) ?? "Pendiente"}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: "right" }}>
                                <button
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: '1px solid #3b82f6',
                                    background: 'white',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.background = '#3b82f6';
                                    e.target.style.color = 'white';
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.color = '#3b82f6';
                                  }}
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
              </div>
            </div>
          )}

          {/* Actividades */}
          {tab === "actividades" && (
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: '#333', borderBottom: '2px solid #8b5cf6', paddingBottom: '0.5rem' }}>
                Actividades {acts.length ? `(${acts.length})` : ""}
              </h4>
              {errors.acts && (
                <div style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  {errors.acts}
                </div>
              )}
              <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {loading.acts ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Cargando actividades...</div>
                ) : acts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay actividades registradas.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {acts.map((a) => {
                      const id = v(a, ["idActivity", "idActividad", "id"]);
                      const tipo = v(a, ["activityType", "type", "tipo", "tipoActividad"]) || "Actividad";
                      const desc = v(a, ["description", "title", "asunto", "descripcion"]) || "-";
                      const fecha = v(a, ["activityDate", "date", "fecha", "fechaActividad", "createdAt"]);
                      return (
                        <div key={id} style={{
                          background: '#fff',
                          borderRadius: '8px',
                          padding: '1.5rem',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              background: '#f3e8ff',
                              color: '#7c3aed',
                              border: '1px solid #e9d5ff',
                              fontWeight: '600'
                            }}>
                              {tipo}
                            </span>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                              {fmt(fecha)}
                            </span>
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                            {desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
