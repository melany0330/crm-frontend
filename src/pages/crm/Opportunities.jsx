import { useEffect, useState } from "react";
import OpportunitiesService from "../../service/crm/opportunities.service.js";

const v = (o, list) => list.map(k => o?.[k]).find(x => x !== undefined && x !== null);

export default function Opportunities() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await OpportunitiesService.list();
        setRows(Array.isArray(r) ? r : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h3>Oportunidades</h3>
      {loading ? <p>Cargando…</p> : (
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr><th>Título</th><th>Cliente</th><th>Etapa</th><th>Valor</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center" }}>No hay oportunidades.</td></tr>
            ) : rows.map((o) => {
              const id = v(o, ["idOpportunity", "idOportunidad", "id"]);
              const title = v(o, ["title", "titulo"]) || "-";
              const client = v(o, ["clientName", "cliente", "clienteNombre"]) || "-";
              const stage = v(o, ["stage", "etapa"]) || "-";
              const value = v(o, ["amount", "valor"]) ?? "-";
              return (
                <tr key={id}>
                  <td>{title}</td>
                  <td>{client}</td>
                  <td>{stage}</td>
                  <td>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
