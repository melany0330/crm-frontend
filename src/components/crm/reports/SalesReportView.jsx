import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import useSalesReport from "../../../core/hooks/useSalesReport";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(
    Number(value ?? 0)
  );

const formatInteger = (value) =>
  new Intl.NumberFormat("es-GT", { maximumFractionDigits: 0 }).format(
    Number(value ?? 0)
  );

const buildTrendData = (trend = []) =>
  trend.map((point) => ({
    date: point.date,
    revenue: Number(point.revenue ?? 0),
    orders: Number(point.orders ?? 0),
  }));

const buildBarData = (items = []) =>
  items.map((item) => ({
    label: item.label || "Sin nombre",
    revenue: Number(item.amount ?? 0),
    quantity: Number(item.quantity ?? 0),
  }));

const SummaryCard = ({ title, value, helper }) => (
  <article className="kpi-card elevated">
    <p className="kpi-label">{title}</p>
    <strong className="kpi-value">{value}</strong>
    {helper && <p className="kpi-helper">{helper}</p>}
  </article>
);

export default function SalesReportView() {
  const {
    data,
    loading,
    exporting,
    errorMessage,
    filters,
    handleInputChange,
    applyFilters,
    resetFilters,
    refresh,
    lastUpdated,
    exportReport,
  } = useSalesReport();

  const summary = data?.summary ?? null;
  const trendData = buildTrendData(data?.trend);
  const topProducts = buildBarData(data?.topProducts);
  const ordersByDay = trendData.map((point) => ({
    date: point.date,
    orders: point.orders,
  }));
  const revenueVsDiscounts = summary
    ? [
        { label: "Ingresos", value: Number(summary.totalRevenue ?? 0) },
        { label: "Descuentos", value: Number(summary.totalDiscounts ?? 0) },
      ]
    : [];
  const throughputMetrics = summary
    ? [
        { label: "Pedidos", value: Number(summary.totalOrders ?? 0) },
        { label: "Unidades", value: Number(summary.totalItems ?? 0) },
      ]
    : [];

  const onSubmit = (event) => {
    event.preventDefault();
    applyFilters();
  };

  return (
    <>
      <section className="card elevated">
        <form className="report-filter" onSubmit={onSubmit}>
          <div className="report-filter-grid">
            <label className="field">
              <span>Desde</span>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleInputChange}
                className="input"
                max={filters.endDate || undefined}
              />
            </label>
            <label className="field">
              <span>Hasta</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleInputChange}
                className="input"
                min={filters.startDate || undefined}
              />
            </label>
            <label className="field">
              <span>Cliente (ID opcional)</span>
              <input
                type="number"
                min="1"
                step="1"
                name="clientId"
                value={filters.clientId}
                onChange={handleInputChange}
                className="input"
                placeholder="Ej. 1001"
              />
            </label>
          </div>

          <div className="filter-actions">
            <button type="submit" disabled={loading} className="btn btn-black">
              Aplicar filtros
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={resetFilters}
              className="btn btn-outline"
            >
              Limpiar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={refresh}
              className="btn btn-outline btn-sm"
            >
              Actualizar
            </button>
            <button
              type="button"
              disabled={loading || exporting}
              onClick={() => exportReport()}
              className="btn btn-outline btn-sm"
            >
              Descargar CSV
            </button>
            {lastUpdated && (
              <span className="hint">
                Actualizado {lastUpdated.toLocaleString("es-GT", { hour12: false })}
              </span>
            )}
          </div>
        </form>
      </section>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      {loading && <div className="alert alert-neutral">Generando reporte...</div>}
      {!loading && !data && !errorMessage && (
        <div className="alert alert-neutral">No hay datos para mostrar.</div>
      )}

      {!loading && data && (
        <>
          <section className="card elevated">
            <div className="kpi-grid">
              <SummaryCard title="Ventas totales" value={formatCurrency(summary?.totalRevenue)} />
              <SummaryCard
                title="Pedidos cerrados"
                value={formatInteger(summary?.totalOrders)}
                helper="Periodo seleccionado"
              />
              <SummaryCard
                title="Ticket promedio"
                value={formatCurrency(summary?.averageTicket)}
              />
              <SummaryCard
                title="Unidades vendidas"
                value={formatInteger(summary?.totalItems)}
              />
              <SummaryCard
                title="Descuentos aplicados"
                value={formatCurrency(summary?.totalDiscounts)}
              />
            </div>
          </section>

          {summary && (
            <section className="rank-grid">
              <article className="rank-card elevated">
                <h4 className="section-title">Ingresos vs descuentos</h4>
                <p className="chart-helper">
                  Comparativo directo entre lo facturado y los descuentos aplicados en el periodo.
                </p>
                {revenueVsDiscounts.length === 0 ? (
                  <p className="empty-state">Sin información para graficar.</p>
                ) : (
                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={revenueVsDiscounts} layout="vertical" margin={{ left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="label" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#0ea5e9" name="Monto (GTQ)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </article>

              <article className="rank-card elevated">
                <h4 className="section-title">Volumen de operaciones</h4>
                <p className="chart-helper">
                  Relación entre pedidos cerrados y unidades totales vendidas.
                </p>
                {throughputMetrics.length === 0 ? (
                  <p className="empty-state">Sin información para graficar.</p>
                ) : (
                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={throughputMetrics} layout="vertical" margin={{ left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="label" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#22c55e" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </article>
            </section>
          )}

          <section className="card elevated">
            <h4 className="section-title">Tendencia diaria</h4>
            <p className="chart-helper">
              Línea azul = ingresos acumulados por día; línea naranja = número de pedidos cerrados.
            </p>
            {trendData.length === 0 ? (
              <p className="empty-state">Sin ventas en el rango seleccionado.</p>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      name="Ingresos"
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#f97316"
                      name="Pedidos"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="rank-grid">
            <article className="rank-card elevated">
              <h4 className="section-title">Top productos</h4>
              <p className="chart-helper">
                Barra verde representa ingresos; barra celeste indica unidades vendidas por producto.
              </p>
              {topProducts.length === 0 ? (
                <p className="empty-state">Sin productos destacados.</p>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={topProducts} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="label" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#22c55e" name="Ingresos" />
                      <Bar dataKey="quantity" fill="#0ea5e9" name="Unidades" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>

            <article className="rank-card elevated">
              <h4 className="section-title">Pedidos por día</h4>
              <p className="chart-helper">
                Barras muestran cuántos pedidos se cerraron por fecha dentro del rango filtrado.
              </p>
              {ordersByDay.length === 0 ? (
                <p className="empty-state">No hay pedidos registrados en el periodo.</p>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={ordersByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#f97316" name="Pedidos cerrados" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </>
  );
}
