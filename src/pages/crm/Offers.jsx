import React, { useState } from "react";
import useOffers from "../../core/hooks/useOffers.js";

const fmtPercent = (value) => `${Number(value ?? 0).toFixed(2)} %`;

export default function Offers() {
  const {
    rows,
    loading,
    error,
    search,
    setSearch,
    onlyActive,
    setOnlyActive,
    refresh,
    create,
    update,
    deactivate,
    productOptions,
  } = useOffers();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    nombreDescuento: "",
    idProducto: "",
    cantidadMin: 1,
    porcentaje: 5,
    estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({
      nombreDescuento: "",
      idProducto: "",
      cantidadMin: 1,
      porcentaje: 5,
      estado: true,
    });
    setEditingId(null);
  };

  const startEdit = (row) => {
    setEditingId(row.idDescuento ?? row.id);
    setForm({
      nombreDescuento: row.nombreDescuento || "",
      idProducto: row.product?.idProduct ?? row.product?.id ?? "",
      cantidadMin: row.cantidadMin ?? 1,
      porcentaje: Number(row.porcentaje ?? 5),
      estado: row.estado ?? true,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      nombreDescuento: form.nombreDescuento,
      idProducto: Number(form.idProducto),
      cantidadMin: Number(form.cantidadMin) || 0,
      porcentaje: Number(form.porcentaje) || 0,
      estado: Boolean(form.estado),
    };
    setSaving(true);
    try {
      if (editingId) {
        await update(editingId, payload);
      } else {
        await create(payload);
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    await deactivate(id);
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <section className="crm-wrap nice-font">
      <header className="crm-header">
        <div>
          <h3>Ofertas asociadas a productos</h3>
          <p className="hint">Configura descuentos que luego se aplican en tus cotizaciones.</p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          Recargar
        </button>
      </header>

      <div className="card elevated report-filter">
        <div className="report-filter-grid">
          <label className="field">
            <span>Buscar</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre o producto"
            />
          </label>
          <label className="field checkbox-inline">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            <span>Solo activas</span>
          </label>
          <label className="field checkbox-inline">
            <input type="checkbox" checked={expanded} onChange={(e) => setExpanded(e.target.checked)} />
            <span>Ver detalle</span>
          </label>
        </div>
      </div>

      <section className="card elevated">
        <form className="report-filter" onSubmit={onSubmit}>
          <div className="report-filter-grid">
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={form.nombreDescuento}
                onChange={(e) => setField("nombreDescuento", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Producto</span>
              <select
                value={form.idProducto}
                onChange={(e) => setField("idProducto", e.target.value)}
                required
              >
                <option value="">Selecciona producto…</option>
                {productOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Cantidad mínima</span>
              <input
                type="number"
                min="1"
                value={form.cantidadMin}
                onChange={(e) => setField("cantidadMin", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Porcentaje</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.porcentaje}
                onChange={(e) => setField("porcentaje", e.target.value)}
              />
            </label>
            <label className="field checkbox-inline">
              <input
                type="checkbox"
                checked={!!form.estado}
                onChange={(e) => setField("estado", e.target.checked)}
              />
              <span>Activa</span>
            </label>
          </div>
          <div className="action-group" style={{ justifyContent: "flex-start" }}>
            <button
              className="btn btn-black"
              type="submit"
              disabled={
                saving ||
                !form.nombreDescuento ||
                !form.idProducto ||
                Number(form.cantidadMin) <= 0 ||
                Number(form.porcentaje) <= 0
              }
            >
              {saving ? "Guardando…" : editingId ? "Actualizar oferta" : "Crear oferta"}
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
      {loading && <div className="alert alert-neutral">Cargando ofertas…</div>}

      <div className="table-wrap elevated">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Producto</th>
              <th>Mínimo</th>
              <th>Porcentaje</th>
              <th>Estado</th>
              {expanded && <th>Creada</th>}
              <th style={{ width: 160 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={expanded ? 7 : 6} style={{ textAlign: "center" }}>
                  No hay ofertas configuradas.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const id = row?.idDescuento ?? row?.id;
              const productId =
                row?.product?.idProduct ??
                row?.product?.id ??
                row?.idProducto ??
                row?.productId;
              const productName = row?.product?.name || row?.productName || "-";
              return (
                <tr key={id}>
                  <td>{row?.nombreDescuento || "-"}</td>
                  <td>
                    {productId ? <span className="cell-strong">#{productId}</span> : null} {productName}
                  </td>
                  <td>{row?.cantidadMin ?? "-"}</td>
                  <td>{fmtPercent(row?.porcentaje)}</td>
                  <td>
                    <span className={`tag ${row?.estado ? "" : "tag-muted"}`}>
                      {row?.estado ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  {expanded && (
                    <td>{row?.createdAt ? new Date(row.createdAt).toLocaleDateString("es-GT") : "-"}</td>
                  )}
                  <td>
                    <div className="action-group">
                      <button className="btn chip btn-ghost" onClick={() => startEdit(row)}>
                        Editar
                      </button>
                      <button className="btn chip btn-outline" onClick={() => handleDeactivate(id)}>
                        Desactivar
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
