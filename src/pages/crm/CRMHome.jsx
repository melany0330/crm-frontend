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
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>🏠 Dashboard CRM</h2>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Vista general de clientes y actividades
        </p>
      </div>

      <div className="grid" style={{
        display: "grid",
        gap: 24,
        gridTemplateColumns: window.innerWidth > 768 ? "1.1fr 1fr" : "1fr"
      }}>
        <section style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            color: '#333',
            marginBottom: '1rem',
            fontSize: '1.3rem',
            borderBottom: '2px solid #4ecdc4',
            paddingBottom: '0.5rem'
          }}>
            👥 Clientes
          </h3>
          {cargandoClientes ? (
            <p>Cargando clientes…</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: '#4ecdc4', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>NIT</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{
                        textAlign: "center",
                        padding: '20px',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        No hay clientes registrados
                      </td>
                    </tr>
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
                        style={{
                          cursor: "pointer",
                          background: isSel ? "rgba(78, 205, 196, 0.1)" : "transparent",
                          borderBottom: '1px solid #e9ecef',
                          transition: 'all 0.2s ease'
                        }}
                        title="Click para ver actividades"
                        onMouseOver={(e) => {
                          if (!isSel) e.target.parentNode.style.background = 'rgba(78, 205, 196, 0.05)';
                        }}
                        onMouseOut={(e) => {
                          if (!isSel) e.target.parentNode.style.background = 'transparent';
                        }}
                      >
                        <td style={{ padding: '12px' }}>{nit ?? "-"}</td>
                        <td style={{ padding: '12px' }}>{[nombre, apellido].filter(Boolean).join(" ") || "-"}</td>
                        <td style={{ padding: '12px' }}>{email ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            color: '#333',
            marginBottom: '1rem',
            fontSize: '1.3rem',
            borderBottom: '2px solid #44a08d',
            paddingBottom: '0.5rem'
          }}>
            📋 Actividades{" "}
            {seleccionado && (
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>
                — Cliente: {v(seleccionado, ["nit", "nitCliente"]) || ""} ({v(seleccionado, ["name", "nombre", "nombreCliente"]) || "-"})
              </span>
            )}
          </h3>

          {!seleccionado && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#666',
              background: 'white',
              borderRadius: '8px',
              border: '2px dashed #ddd'
            }}>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>
                👆 Selecciona un cliente para ver sus actividades
              </p>
            </div>
          )}

          {seleccionado && (
            <>
              {cargandoActs && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#666', fontSize: '1.1rem' }}>🔄 Cargando actividades…</p>
                </div>
              )}
              {!cargandoActs && actividades.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#999',
                  background: 'white',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>
                    📝 Sin actividades registradas
                  </p>
                </div>
              )}
              {!cargandoActs && actividades.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  {actividades.map((a, index) => {
                    const id = v(a, ["idActivity", "idActividad", "id"]);
                    const tipo = v(a, ["type", "tipo", "tipoActividad"]) || "Actividad";
                    const titulo = v(a, ["title", "asunto", "descripcion"]) || "-";
                    const fecha = v(a, ["date", "fecha", "fechaActividad", "createdAt"]);
                    return (
                      <div key={id} style={{
                        padding: '12px',
                        borderBottom: index < actividades.length - 1 ? '1px solid #e9ecef' : 'none',
                        borderLeft: '4px solid #44a08d',
                        marginBottom: index < actividades.length - 1 ? '8px' : '0',
                        background: '#f8f9fa'
                      }}>
                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                          {tipo}
                        </div>
                        <div style={{ color: '#666', marginBottom: '4px' }}>
                          {titulo}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#999' }}>
                          📅 {fmt(fecha)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
