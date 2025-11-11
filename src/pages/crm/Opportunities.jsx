import React, { useState } from "react";
import useOpportunitiesBoard from "../../core/hooks/useOpportunitiesBoard.js";

const fmtCurrency = (value) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(Number(value ?? 0));

export default function Opportunities() {
  const {
    rows,
    loading,
    error,
    search,
    setSearch,
    changeStatus,
    form,
    setFormField,
    submitForm,
    saving,
    editingId,
    startEdit,
    resetForm,
    deleteOpportunity,
    clientOptions,
    userOptions,
    quoteOptions,
    stageFilter,
    setStageFilter,
    stageOptions,
  } = useOpportunitiesBoard();
  const [rowStatus, setRowStatus] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitForm();
  };

  return (
    <section className="crm-wrap nice-font">
      <header className="crm-header">
        <div>
          <h3>Oportunidades comerciales</h3>
          <p className="hint">Gestiona etapas y valores estimados desde una vista tabular.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select className="input" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            {stageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="search"
            placeholder="Buscar cliente o responsable"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
              <span>Cotización (opcional)</span>
              <select value={form.quoteId} onChange={(e) => setFormField("quoteId", e.target.value)}>
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
              <select value={form.status} onChange={(e) => setFormField("status", e.target.value)}>
                {stageOptions
                  .filter((opt) => opt !== "TODOS")
                  .map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
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
                onChange={(e) => setFormField("expectedCloseDate", e.target.value)}
              />
            </label>
          </div>
          <div className="action-group" style={{ justifyContent: "flex-start" }}>
            <button className="btn btn-black" type="submit" disabled={saving}>
              {saving ? "Guardando…" : editingId ? "Actualizar oportunidad" : "Crear oportunidad"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="alert alert-neutral">Cargando oportunidades…</div>}

      <div className="table-wrap elevated">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Probabilidad</th>
              <th>Valor</th>
              <th>Fecha cierre</th>
              <th style={{ width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No hay oportunidades que coincidan con los filtros.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const id = row?.idOpportunity ?? row?.id ?? "";
              const clientId =
                row?.clientId ??
                row?.client?.idClient ??
                row?.client?.id;
              const clientName =
                row?.client?.nombreCliente ||
                row?.client?.name ||
                row?.clientName ||
                row?.cliente?.nombre ||
                "-";
              const ownerId = row?.userId ?? row?.user?.id;
              const ownerName = row?.user?.name || row?.userName || "-";
              const stage = row?.status || "-";
              const value = fmtCurrency(row?.estimatedValue ?? row?.valorEstimado ?? 0);
              const probability = row?.probability ? `${row.probability}%` : "-";
              const closeDate = row?.expectedCloseDate
                ? new Date(row.expectedCloseDate).toLocaleDateString("es-GT")
                : "-";

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    {clientId ? <span className="cell-strong">#{clientId}</span> : null} {clientName}
                  </td>
                  <td>
                    {ownerId ? <span className="cell-strong">#{ownerId}</span> : null} {ownerName}
                  </td>
                  <td>
                    <span className="tag">{stage}</span>
                  </td>
                  <td>{probability}</td>
                  <td>{value}</td>
                  <td>{closeDate}</td>
                  <td>
                    <div className="action-group">
                      <select
                        className="chip"
                        value={rowStatus[id] ?? ""}
                        onChange={(e) =>
                          setRowStatus((prev) => ({ ...prev, [id]: e.target.value }))
                        }
                      >
                        <option value="">Cambiar etapa…</option>
                        {stageOptions
                          .filter((opt) => opt !== "TODOS")
                          .map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                      <button
                        className="btn chip btn-black"
                        disabled={!rowStatus[id]}
                        onClick={() => {
                          changeStatus(id, rowStatus[id]);
                          setRowStatus((prev) => ({ ...prev, [id]: "" }));
                        }}
                      >
                        Guardar
                      </button>
                      <button className="btn chip btn-ghost" onClick={() => startEdit(row)}>
                        Editar
                      </button>
                      <button className="btn chip btn-outline" onClick={() => deleteOpportunity(id)}>
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
