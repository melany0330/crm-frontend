import { useEffect, useState } from "react";
import ReportsService from "../../service/crm/reports.service.js";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await ReportsService.summary(); // ajusta si tu service usa otro método
        setSummary(r || {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h3>Reportes</h3>
      {loading ? (
        <p>Cargando…</p>
      ) : !summary ? (
        <p>No hay datos de reportes.</p>
      ) : (
        <pre style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
          {JSON.stringify(summary, null, 2)}
        </pre>
      )}
    </section>
  );
}
