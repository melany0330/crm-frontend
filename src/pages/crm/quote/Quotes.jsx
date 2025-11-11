import React, { useState } from "react";
import useQuotesBoard from "../../../core/hooks/useQuotesBoard.js";

const fmtCurrency = (value) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(Number(value ?? 0));

const fmtDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString("es-GT", { hour12: false });
};

export default function Quotes() {
  const {
    rows,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    statusOptions,
    loadDetails,
    detailsCache,
    detailsLoading,
    updateStatus,
    form,
    setFormField,
    setDetailField,
    addDetailRow,
    removeDetailRow,
    editingId,
    startEdit,
    resetForm,
    submitForm,
    saving,
    deleteQuote,
    clientOptions,
    userOptions,
    productMap,
    offersByProduct,
  } = useQuotesBoard();

  const [openDetails, setOpenDetails] = useState(new Set());
  const [nextStatus, setNextStatus] = useState({});
  const hasProductDetails = form.details.some((detail) => detail.idProduct);
  const canSubmit = form.idClient && form.idUser && hasProductDetails && !saving;

  const toggleDetails = async (idQuote) => {
    if (!idQuote) return;
    const next = new Set(openDetails);
    if (next.has(idQuote)) {
      next.delete(idQuote);
      setOpenDetails(next);
      return;
    }
    await loadDetails(idQuote);
    next.add(idQuote);
    setOpenDetails(next);
  };

  const handleStatusChange = async (idQuote) => {
    const status = nextStatus[idQuote];
    if (!status) return;
    await updateStatus(idQuote, status);
    setNextStatus((prev) => ({ ...prev, [idQuote]: "" }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitForm();
  };

  return (
    <section className="crm-wrap nice-font">
      <header className="crm-header">
        <div>
          <h3>Cotizaciones de clientes</h3>
          <p className="hint">Aplica filtros para dar seguimiento y generar ofertas rápidamente.</p>
        </div>
      </header>

      <section className="card elevated">
        <form className="report-filter" onSubmit={onSubmit}>
          <div className="report-filter-grid">
            <label className="field">
              <span>Cliente</span>
              <select
                value={form.idClient}
                onChange={(e) => setFormField("idClient", e.target.value)}
                required
              >
                <option value="">Selecciona un cliente…</option>
                {clientOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Vendedor</span>
              <select
                value={form.idUser}
                onChange={(e) => setFormField("idUser", e.target.value)}
                required
              >
                <option value="">Selecciona vendedor…</option>
                {userOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Fecha</span>
              <input
                type="datetime-local"
                value={form.quoteDate}
                onChange={(e) => setFormField("quoteDate", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="detail-grid">
            {form.details.map((detail, idx) => {
              const offers = offersByProduct[Number(detail.idProduct)] || [];
              return (
                <article key={`detail-${idx}`} className="detail-card">
                  <div className="field">
                    <span>Producto</span>
                    <select
                      value={detail.idProduct}
                      onChange={(e) => setDetailField(idx, "idProduct", e.target.value)}
                      required
                    >
                      <option value="">Selecciona producto…</option>
                      {Object.entries(productMap).map(([id, label]) => (
                        <option key={id} value={id}>
                          #{id} - {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <span>Cantidad</span>
                    <input
                      type="number"
                      min="1"
                      value={detail.quantity}
                      onChange={(e) => setDetailField(idx, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <span>Precio unitario</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.unitPrice}
                      onChange={(e) => setDetailField(idx, "unitPrice", e.target.value)}
                      required
                    />
                  </div>
                  {offers.length > 0 && (
                    <div className="field">
                      <span>Oferta</span>
                      <select
                        value={detail.offerId}
                        onChange={(e) => setDetailField(idx, "offerId", e.target.value)}
                      >
                        <option value="">Sin oferta</option>
                        {offers.map((offer) => (
                          <option key={offer.id} value={offer.id}>
                            {offer.label} ({offer.porcentaje}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {form.details.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => removeDetailRow(idx)}
                    >
                      Quitar
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <div className="action-group" style={{ justifyContent: "flex-start" }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={addDetailRow}>
              Añadir producto
            </button>
          </div>

          <div className="action-group" style={{ justifyContent: "flex-start" }}>
            <button type="submit" className="btn btn-black" disabled={!canSubmit}>
              {saving ? "Guardando…" : editingId ? "Actualizar cotización" : "Crear cotización"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
            {!hasProductDetails && (
              <span className="hint">Agrega al menos un producto antes de guardar.</span>
            )}
          </div>
        </form>
      </section>

      <div className="card elevated report-filter">
        <div className="report-filter-grid">
          <label className="field">
            <span>Buscar</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cliente, vendedor o ID"
            />
          </label>
          <label className="field">
            <span>Estado</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="alert alert-neutral">Cargando cotizaciones…</div>}

      <div className="table-wrap elevated">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th style={{ width: 240 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No hay cotizaciones para los filtros seleccionados.
                </td>
              </tr>
            )}

            {rows.map((row) => {
              const id = row?.idQuote ?? row?.id ?? "";
              const clientId =
                row?.idClient ??
                row?.clientId ??
                row?.client?.idClient ??
                row?.client?.id;
              const clientName =
                row?.client?.nombreCliente ||
                row?.client?.name ||
                row?.clientName ||
                row?.cliente?.nombre ||
                "-";
              const sellerId = row?.idUser ?? row?.userId ?? row?.user?.id;
              const sellerName = row?.user?.name || row?.userName || "-";
              const status = row?.status || "-";
              const isOpen = openDetails.has(id);
              const details = detailsCache[id] ?? [];
              const isLoadingDetail = detailsLoading[id];

              return (
                <React.Fragment key={id}>
                  <tr>
                    <td>{id}</td>
                    <td>
                      {clientId ? <span className="cell-strong">#{clientId}</span> : null} {clientName}
                    </td>
                    <td>
                      {sellerId ? <span className="cell-strong">#{sellerId}</span> : null} {sellerName}
                    </td>
                    <td>{fmtDate(row?.quoteDate)}</td>
                    <td>{fmtCurrency(row?.total)}</td>
                    <td>
                      <span className="tag">{status}</span>
                    </td>
                    <td>
                    <div className="action-group">
                      <button className="btn chip btn-outline" onClick={() => toggleDetails(id)}>
                        {isOpen ? "Ocultar detalle" : "Ver detalle"}
                      </button>
                        <select
                          className="chip"
                          value={nextStatus[id] ?? ""}
                          onChange={(e) =>
                            setNextStatus((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                        >
                          <option value="">Actualizar estado…</option>
                          {statusOptions
                            .filter((opt) => opt !== "TODOS")
                            .map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      <button
                        className="btn chip btn-black"
                        disabled={!nextStatus[id]}
                        onClick={() => handleStatusChange(id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn chip btn-ghost"
                        onClick={() => startEdit(row)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn chip btn-outline"
                        onClick={() => deleteQuote(id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
                  {isOpen && (
                    <tr className="quote-details-row">
                      <td colSpan={7}>
                        {isLoadingDetail ? (
                          <p>Cargando detalle…</p>
                        ) : details.length === 0 ? (
                          <p>No hay productos registrados en esta cotización.</p>
                        ) : (
                          <div className="detail-grid">
                            {details.map((item, idx) => (
                              <article key={idx} className="detail-card">
                                <strong>{item.name}</strong>
                                <p>Cantidad: {item.qty}</p>
                                <p>Precio: {fmtCurrency(item.price)}</p>
                                <p>Subtotal: {fmtCurrency(item.subtotal)}</p>
                              </article>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
