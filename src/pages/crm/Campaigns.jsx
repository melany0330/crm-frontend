import { useEffect, useState } from "react";
import CampaignsService from "../../service/crm/campaigns.service.js";

const v = (o, list) => list.map(k => o?.[k]).find(x => x !== undefined && x !== null);

export default function Campaigns() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await CampaignsService.list();
        setRows(Array.isArray(r) ? r : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h3>Campañas</h3>
      {loading ? <p>Cargando…</p> : (
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr><th>Nombre</th><th>Estado</th><th>Presupuesto</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: "center" }}>No hay campañas.</td></tr>
            ) : rows.map((c) => {
              const id = v(c, ["idCampaign", "idCampana", "id"]);
              const name = v(c, ["name", "nombre"]) || "-";
              const status = v(c, ["status", "estado"])?.toString() || "-";
              const budget = v(c, ["budget", "presupuesto"]) ?? "-";
              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{status}</td>
                  <td>{budget}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
