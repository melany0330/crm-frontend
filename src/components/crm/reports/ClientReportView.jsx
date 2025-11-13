import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import useClientReport from "../../../core/hooks/useClientReport";

const currency = (value) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(
    Number(value ?? 0)
  );

const number = (value) =>
  new Intl.NumberFormat("es-GT", { maximumFractionDigits: 0 }).format(Number(value ?? 0));

const transformTopClients = (list = []) =>
  list.map((item) => ({
    clientName: item.clientName || "Sin nombre",
    revenue: Number(item.totalRevenue ?? 0),
    orders: Number(item.totalOrders ?? 0),
    ticket: Number(item.averageTicket ?? 0),
  }));

const transformTrend = (trend = []) =>
  trend.map((point) => ({
    date: point.date,
    revenue: Number(point.revenue ?? 0),
    orders: Number(point.orders ?? 0),
  }));

const SummaryCard = ({ title, value }) => (
  <article className="kpi-card elevated">
    <p className="kpi-label">{title}</p>
    <strong className="kpi-value">{value}</strong>
  </article>
);

export default function ClientReportView() {
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
  } = useClientReport();

  const summary = data?.summary ?? null;
  const topClients = transformTopClients(data?.topClients);
  const trendData = transformTrend(data?.trend);
  const ticketData = topClients.map((client) => ({
    clientName: client.clientName,
    ticket: client.ticket,
  }));

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
                name="clientId"
                value={filters.clientId}
                onChange={handleInputChange}
                className="input"
                placeholder="Ej. 200"
              />
            </label>
            <label className="field">
              <span>Categoria (ID opcional)</span>
              <input
                type="number"
                min="1"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleInputChange}
                className="input"
                placeholder="Ej. 10"
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
              <SummaryCard title="Ventas registradas" value={currency(summary?.totalRevenue)} />
              <SummaryCard title="Clientes impactados" value={number(summary?.totalClients)} />
              <SummaryCard title="Pedidos" value={number(summary?.totalOrders)} />
              <SummaryCard title="Ticket promedio" value={currency(summary?.averageTicket)} />
            </div>
          </section>

          <section className="card elevated">
            <h4 className="section-title">Clientes principales</h4>
            <p className="chart-helper">
              Barra azul muestra ingresos acumulados; barra naranja representa cantidad de pedidos por cliente.
            </p>
            {topClients.length === 0 ? (
              <p className="empty-state">Sin clientes destacados.</p>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={topClients} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="clientName" width={140} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#0ea5e9" name="Ingresos" />
                    <Bar dataKey="orders" fill="#f97316" name="Pedidos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="card elevated">
            <h4 className="section-title">Ticket promedio por cliente</h4>
            <p className="chart-helper">
              Muestra cuánto gasta en promedio cada cliente destacado por pedido realizado.
            </p>
            {ticketData.length === 0 ? (
              <p className="empty-state">Sin información de ticket promedio.</p>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={ticketData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="clientName" width={140} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ticket" fill="#a855f7" name="Ticket promedio (GTQ)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="card elevated">
            <h4 className="section-title">Tendencia de compras</h4>
            <p className="chart-helper">
              Ingresos y pedidos realizados por el cliente a lo largo del rango seleccionado.
            </p>
            {trendData.length === 0 ? (
              <p className="empty-state">Sin datos en el rango.</p>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" dot={false} name="Ingresos" />
                    <Line type="monotone" dataKey="orders" stroke="#f97316" dot={false} name="Pedidos" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
