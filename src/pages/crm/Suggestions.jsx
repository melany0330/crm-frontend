import React, { useMemo, useState } from "react";
import useSuggestions from "../../core/hooks/useSuggestions.js";
import OpportunitiesService from "../../service/crm/opportunities.service.js";

const fmtDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("es-GT");
};

export default function Suggestions() {
  const {
    rows,
    loading,
    error,
    refresh,
    clientOptions,
    userOptions,
    quoteOptions,
    form,
    setFormField,
    submitForm,
    saving,
    editingId,
    startEdit,
    resetForm,
    deleteSuggestion,
  } = useSuggestions();
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState("TODOS");
  const [pendingStatus, setPendingStatus] = useState({});
  const statusOptions = ["ABIERTA", "EN_PROCESO", "GANADA", "PERDIDA"];

  const convertToActive = async (row) => {
    const id = row?.idOpportunity ?? row?.id;
    if (!id) return;
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await OpportunitiesService.changeStatus(id, { status: "EN_PROCESO" });
      await refresh();
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const viewRows = useMemo(() => {
    if (filter === "TODOS") return rows;
    const normalized = filter.toUpperCase();
    return rows.filter((row) => {
        const status = (row?.status || "").trim().toUpperCase();
        return status === normalized;
    });
  }, [rows, filter]);

  const handleStatusChange = async (row) => {
    const id = row?.idOpportunity ?? row?.id;
    const next = pendingStatus[id];
    if (!id || !next) return;
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await OpportunitiesService.changeStatus(id, { status: next });
      await refresh();
      setPendingStatus((prev) => ({ ...prev, [id]: "" }));
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const canSubmit = form.clientId && form.userId && !saving;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    await submitForm();
  };

  return (
    <section className="crm-wrap nice-font">
      <header className="crm-header">
        <div>
          <h3>Sugerencias de clientes</h3>
          <p className="hint">
            Basado en oportunidades activas y cotizaciones pendientes.
          </p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          Actualizar
        </button>
      </header>

      <section className="card elevated">
        <form className="report-filter" onSubmit={onSubmit}>
          <div className="report-filter-grid">
            <label className="field">
              <span>Cliente</span>
              <select
                value={form.clientId}
                onChange={(e) => setFormField("clientId", e.target.value)}
                required
              >
                <option value="">Selecciona cliente…</option>
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
                value={form.userId}
                onChange={(e) => setFormField("userId", e.target.value)}
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
              <span>Cotización</span>
              <select
                value={form.quoteId}
                onChange={(e) => setFormField("quoteId", e.target.value)}
              >
                <option value="">Sin cotización</option>
                {quoteOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Estado</span>
              <select
                value={form.status}
                onChange={(e) => setFormField("status", e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Probabilidad (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => setFormField("probability", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Valor estimado</span>
              <input
                type="number"
                min="0"
                value={form.estimatedValue}
                onChange={(e) => setFormField("estimatedValue", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Fecha cierre esperada</span>
              <input
                type="date"
                value={form.expectedCloseDate}
                onChange={(e) =>
                  setFormField("expectedCloseDate", e.target.value)
                }
              />
            </label>
          </div>
          <div
            className="action-group"
            style={{ justifyContent: "flex-start" }}
          >
            <button className="btn btn-black" disabled={!canSubmit}>
              {saving
                ? "Guardando…"
                : editingId
                ? "Actualizar sugerencia"
                : "Crear sugerencia"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="report-filter" style={{ marginBottom: 12 }}>
        <label className="field" style={{ maxWidth: 220 }}>
          <span>Filtrar por estado</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="TODOS">Todos</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && (
        <div className="alert alert-neutral">Cargando sugerencias…</div>
      )}

      <div className="table-wrap elevated">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Probabilidad</th>
              <th>Valor estimado</th>
              <th>Fecha cierre esperada</th>
              <th style={{ width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && viewRows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No hay sugerencias disponibles.
                </td>
              </tr>
            )}
            {viewRows.map((row) => {
              const id = row?.idOpportunity ?? row?.id;
              const statusUp = (row?.status || "").trim().toUpperCase();
              const isOpen = statusUp === "ABIERTA" || statusUp === "";
              const isInProcess = statusUp === "EN_PROCESO";
              const isClosed = !isOpen && !isInProcess;
              const showConvertButton = !isInProcess;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    {row?.client?.idClient ? (
                      <span className="cell-strong">
                        #{row.client.idClient}
                      </span>
                    ) : null}{" "}
                    {row?.client?.nombreCliente ||
                      row?.client?.name ||
                      row?.clientName ||
                      row?.cliente?.nombre ||
                      "-"}
                  </td>
                  <td>
                    <span className="tag">{row?.status}</span>
                  </td>
                  <td>{row?.probability ? `${row.probability}%` : "-"}</td>
                  <td>{row?.estimatedValue ?? row?.valorEstimado ?? "-"}</td>
                  <td>{fmtDate(row?.expectedCloseDate)}</td>
                  <td>
                    <div
                      className="action-group"
                      style={{ justifyContent: "flex-start" }}
                    >
                      <>
                        <select
                          className="chip"
                          value={pendingStatus[id] ?? ""}
                          onChange={(e) =>
                            setPendingStatus((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Cambiar estado…</option>
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn chip btn-black"
                          disabled={!pendingStatus[id]}
                          onClick={() => handleStatusChange(row)}
                        >
                          Guardar
                        </button>
                        {showConvertButton && (
                          <button
                            className="btn chip btn-outline"
                            disabled={updating[id]}
                            onClick={() => convertToActive(row)}
                          >
                            {updating[id]
                              ? "Actualizando…"
                              : isClosed
                                ? "Reabrir"
                                : "Mover a EN_PROCESO"}
                          </button>
                        )}
                      </>
                      <button
                        className="btn chip btn-ghost"
                        onClick={() => startEdit(row)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn chip btn-outline"
                        onClick={() => deleteSuggestion(id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
