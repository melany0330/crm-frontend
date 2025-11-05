import { useEffect, useState } from "react";
import ClientsService from "../../service/crm/clients.service.js";
import ActivitiesService from "../../service/crm/activities.service.js";

const v = (o, list) => list.map(k => o?.[k]).find(x => x !== undefined && x !== null);

export default function CRMHome() {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [cargandoActs, setCargandoActs] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setCargandoClientes(true);
        const data = await ClientsService.list();
        setClientes(Array.isArray(data) ? data : []);
      } finally {
        setCargandoClientes(false);
      }
    })();
  }, []);

  const seleccionar = async (c) => {
    setSeleccionado(c);
    setActividades([]);
    const id = v(c, ["idClient", "idCliente", "id"]);
    if (!id) return;

    try {
      setCargandoActs(true);
      const res = await ActivitiesService.listByClient(id);
      setActividades(Array.isArray(res) ? res : []);
    } finally {
      setCargandoActs(false);
    }
  };

  const fmt = (s) => {
    if (!s) return "-";
    const d = new Date(s);
    return isNaN(d) ? s : d.toLocaleString("es-GT", { hour12: false });
    };

  return (
    <div className="grid" style={{ display: "grid", gap: 24, gridTemplateColumns: "1.1fr 1fr" }}>
      <section>
        <h3>Clientes</h3>
        {cargandoClientes ? (
          <p>Cargando clientes…</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>NIT</th>
                  <th>Nombre</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: "center" }}>No hay clientes.</td></tr>
                ) : clientes.map((c) => {
                  const id = v(c, ["idClient", "idCliente", "id"]);
                  const nit = v(c, ["nit", "nitCliente"]);
                  const nombre = v(c, ["name", "nombre", "nombreCliente"]);
                  const apellido = v(c, ["apellidoCliente"]);
                  const email = v(c, ["email", "correo", "correoCliente"]);
                  const isSel = v(seleccionado ?? {}, ["idClient", "idCliente", "id"]) === id;

                  return (
                    <tr
                      key={id ?? nit}
                      onClick={() => seleccionar(c)}
                      style={{ cursor: "pointer", background: isSel ? "rgba(0,0,0,0.04)" : "transparent" }}
                      title="Ver actividades"
                    >
                      <td>{nit ?? "-"}</td>
                      <td>{[nombre, apellido].filter(Boolean).join(" ") || "-"}</td>
                      <td>{email ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3>
          Actividades{" "}
          {seleccionado && `— Cliente: ${v(seleccionado, ["nit", "nitCliente"]) || ""} (${v(seleccionado, ["name", "nombre", "nombreCliente"]) || "-"})`}
        </h3>

        {!seleccionado && <p>Selecciona un cliente para ver sus actividades.</p>}

        {seleccionado && (
          <>
            {cargandoActs && <p>Cargando actividades…</p>}
            {!cargandoActs && actividades.length === 0 && <p>Sin actividades registradas.</p>}
            {!cargandoActs && actividades.length > 0 && (
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {actividades.map((a) => {
                  const id = v(a, ["idActivity", "idActividad", "id"]);
                  const tipo = v(a, ["type", "tipo", "tipoActividad"]) || "Actividad";
                  const titulo = v(a, ["title", "asunto", "descripcion"]) || "-";
                  const fecha = v(a, ["date", "fecha", "fechaActividad", "createdAt"]);
                  return (
                    <li key={id}>
                      <strong>{tipo}</strong> — {titulo} <em>({fmt(fecha)})</em>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
