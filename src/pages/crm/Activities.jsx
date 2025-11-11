// src/pages/crm/Activities.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ActivitiesService from "../../service/crm/activities.service.js";
import ClientsService from "../../service/crm/clients.service.js";
import { logActivity } from "../../core/system/activityLogger.js";
import {
  getAuthToken,
  getAuthUserId,
  getAuthUserName,
} from "../../core/service/ServerService.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./crm.css";

const v = (o, list) => list.map((k) => o?.[k]).find((x) => x !== undefined && x !== null);

// Backend keys → etiquetas ES (UI)
const TYPE_LABEL = {
  CALL: "Llamada",
  MEETING: "Reunión",
  EMAIL: "Email",
  REMINDER: "Recordatorio",
  NOTE: "Nota",
};
const TYPES = Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label }));

const toLocalDT = (date = new Date()) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(
    date.getHours()
  )}:${p(date.getMinutes())}`;
};

const getTypeColor = (type) => {
  const colors = {
    CALL: { bg: '#dbeafe', text: '#1e40af' },
    MEETING: { bg: '#f3e8ff', text: '#7c3aed' },
    EMAIL: { bg: '#fef3c7', text: '#92400e' },
    REMINDER: { bg: '#fce7f3', text: '#be185d' },
    NOTE: { bg: '#ecfdf5', text: '#059669' }
  };
  return colors[type] || colors.NOTE;
};

const fmt = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  return isNaN(d) ? String(s) : d.toLocaleString("es-GT", { hour12: false });
};

// Persistencias livianas en localStorage
const DONE_KEY = "crm_done_activities";
const NOTIFIED_KEY = "crm_notified_activities"; // “próxima 0–15”
const H1_KEY = "crm_notified_activities_h1";   // “1 hora antes”

function useLocalSet(key) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      return new Set(Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  };
  const write = (set) => localStorage.setItem(key, JSON.stringify(Array.from(set)));
  const add = (id) => {
    const s = read();
    s.add(Number(id));
    write(s);
  };
  const has = (id) => read().has(Number(id));
  const remove = (id) => {
    const s = read();
    s.delete(Number(id));
    write(s);
  };
  return { add, has, remove };
}

export default function Activities() {
  // Tabla
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Formulario
  const [openForm, setOpenForm] = useState(true);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [tipo, setTipo] = useState("NOTE");
  const [fecha, setFecha] = useState(toLocalDT());
  const [descripcion, setDescripcion] = useState("");

  // Edición
  const [editId, setEditId] = useState(null);
  const [editingIsDone, setEditingIsDone] = useState(false); // bloquear inputs si ya estaba hecha

  // Usuario
  const [userId, setUserId] = useState(getAuthUserId());
  const [userName, setUserName] = useState(getAuthUserName());

  const formDisabled = useMemo(
    () => !clientId || !tipo || !descripcion.trim() || !userId || editingIsDone,
    [clientId, tipo, descripcion, userId, editingIsDone]
  );
  const [saving, setSaving] = useState(false);

  // Mapa clientes
  const clientsMap = useMemo(() => {
    const map = new Map();
    for (const c of clients) {
      const id = v(c, ["clientId", "idClient", "idCliente", "id"]);
      const first = v(c, ["firstName", "nombre", "name", "nombreCliente"]);
      const last = v(c, ["lastName", "apellidoCliente"]);
      const nit = v(c, ["nit", "nitCliente"]);
      const display =
        [first, last].filter(Boolean).join(" ").trim() || (nit ? String(nit) : "Sin nombre");
      if (id != null) map.set(Number(id), display);
    }
    return map;
  }, [clients]);

  // Carga
  const loadAll = async () => {
    const token = getAuthToken();
    if (!token) {
      setRows([]);
      setErr("Debes iniciar sesión para ver actividades.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const list = await ActivitiesService.list();
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Error al cargar actividades");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserId(getAuthUserId());
    setUserName(getAuthUserName());
    loadAll();
    ClientsService.list()
      .then((r) => setClients(Array.isArray(r) ? r : []))
      .catch(() => setClients([]));
  }, []);

  // Helpers done/notified
  const doneStore = useLocalSet(DONE_KEY);
  const notifiedStore = useLocalSet(NOTIFIED_KEY); // próxima (0–15)
  const notifiedH1Store = useLocalSet(H1_KEY);     // 1 hora antes

  const isDone = (act) => {
    const id = v(act, ["idActivity", "idActividad", "id"]);
    return id ? doneStore.has(id) : false;
  };

  const markDone = (act) => {
    const id = v(act, ["idActivity", "idActividad", "id"]);
    if (!id) return;
    doneStore.add(id);
    toast.success("Actividad marcada como realizada");
    if (editId && Number(editId) === Number(id)) setEditingIsDone(true);
  };

  // Reset form
  const resetForm = () => {
    setDescripcion("");
    setTipo("NOTE");
    setFecha(toLocalDT());
    setClientId("");
    setEditId(null);
    setEditingIsDone(false);
  };

  // Crear / Actualizar
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      toast.error("Debe iniciar sesión.");
      return;
    }
    if (formDisabled) return;

    setSaving(true);
    try {
      if (editId) {
        if (editingIsDone) {
          toast.warn("No es posible editar una actividad marcada como realizada.");
          return;
        }
        await ActivitiesService.update(Number(editId), {
          clientId: Number(clientId),
          userId: Number(userId),
          activityType: tipo,
          description: descripcion,
          activityDate: `${fecha}:00`,
        });
        toast.success("Actividad actualizada");
      } else {
        await logActivity({
          clientId: Number(clientId),
          userId: Number(userId),
          tipo,
          descripcion,
          date: `${fecha}:00`,
        });
        toast.success("Actividad creada");
      }
      await loadAll();
      resetForm();
    } catch (e2) {
      toast.error(e2?.response?.data?.message || e2?.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  // Editar
  const onEdit = (act) => {
    if (isDone(act)) {
      toast.info("Esta actividad ya está marcada como realizada. No se puede editar.");
      return;
    }
    const id = v(act, ["idActivity", "idActividad", "id"]);
    const cId =
      v(act, ["clientId", "idClient", "idCliente"]) ||
      v(act, ["client", "cliente"])?.idClient ||
      v(act, ["client", "cliente"])?.idCliente ||
      v(act, ["client", "cliente"])?.id;
    setEditId(id);
    setClientId(String(cId || ""));
    setTipo(v(act, ["activityType", "tipoActividad", "type"]) || "NOTE");
    setFecha(toLocalDT(new Date(v(act, ["activityDate", "fechaActividad", "date"]))));
    setDescripcion(v(act, ["description", "descripcion", "title"]) || "");
    setEditingIsDone(false);
    setOpenForm(true);
  };

  // Eliminar
  const onDelete = async (act) => {
    const id = v(act, ["idActivity", "idActividad", "id"]);
    if (!id) return;
    if (isDone(act)) {
      toast.info("Esta actividad ya está marcada como realizada. No se puede eliminar.");
      return;
    }
    const ok = window.confirm("¿Eliminar la actividad?");
    if (!ok) return;
    try {
      await ActivitiesService.deactivate(Number(id));
      toast.success("Actividad eliminada");
      doneStore.remove(id);
      await loadAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "No se pudo eliminar");
    }
  };

  // ====== Notificaciones (sin duplicados) ======
  // Guardamos la lista actual en un ref para que el intervalo no dependa de `rows`
  const rowsRef = useRef([]);
  useEffect(() => { rowsRef.current = rows; }, [rows]);

  // Deduplicación en sesión por clave (maneja StrictMode y dobles render)
  const sessionSentRef = useRef(new Set());
  const notifyOnce = (key, fn) => {
    if (sessionSentRef.current.has(key)) return;
    sessionSentRef.current.add(key);
    fn();
  };

  const resolveClientName = (activity) => {
    const c = v(activity, ["client", "cliente"]) || {};
    const idFromObj = v(c, ["clientId", "idClient", "idCliente", "id"]);
    const byObj = [v(c, ["firstName", "nombre", "name", "nombreCliente"]), v(c, ["lastName", "apellidoCliente"])]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (byObj) return byObj;

    const idFromActivity = v(activity, ["clientId", "idClient", "idCliente"]);
    const id = Number(idFromObj ?? idFromActivity);
    if (!Number.isNaN(id) && clientsMap.has(id)) return clientsMap.get(id);

    const cName = v(activity, ["clientName", "nombreCliente", "name"]);
    if (cName) return cName;

    return "Sin nombre";
  };

  // Chequea y emite notificaciones sobre una lista dada
  const checkNotifications = (rowsList = []) => {
    const now = new Date();

    const soonWindowMin = 15;  // próxima: 0–15 minutos
    const hourWindowLow = 59;  // 1 hora antes: ventana de tolerancia
    const hourWindowHigh = 61;

    rowsList.forEach((a) => {
      const id = v(a, ["idActivity", "idActividad", "id"]);
      const rawType = v(a, ["activityType", "tipoActividad", "type"]) || "REMINDER";
      const tipoES = TYPE_LABEL[rawType] || rawType;
      const dateStr = v(a, ["activityDate", "fechaActividad", "date", "createdAt"]) || "";
      const when = new Date(dateStr);

      if (!id || isNaN(when)) return;
      if (doneStore.has(id)) return;

      const diffMin = (when.getTime() - now.getTime()) / 60000;

      // 1) “1 hora antes” — solo una vez por actividad
      if (!notifiedH1Store.has(id) && diffMin <= hourWindowHigh && diffMin >= hourWindowLow) {
        const key = `h1-${id}`;
        notifyOnce(key, () =>
          toast.info(
            `Falta 1 hora para: ${tipoES} con ${resolveClientName(a)} (${when.toLocaleTimeString("es-GT", { hour12: false })})`,
            { autoClose: 8000, toastId: key }
          )
        );
        notifiedH1Store.add(id);
        return;
      }

      // 2) Próxima 0–15 min — solo una vez por actividad
      if (!notifiedStore.has(id) && diffMin >= 0 && diffMin <= soonWindowMin) {
        const key = `soon-${id}`;
        notifyOnce(key, () =>
          toast.info(
            `${tipoES} para ${resolveClientName(a)} a las ${when.toLocaleTimeString("es-GT", { hour12: false })}`,
            { autoClose: 8000, toastId: key }
          )
        );
        notifiedStore.add(id);
        return;
      }

      // 3) Atrasada — debe aparecer siempre, incluso al recargar.
      // Para no saturar, se re-muestra cada 10 minutos por actividad (time bucket).
      if (diffMin < 0) {
        const bucket = Math.floor(now.getTime() / 600000); // 10 min
        const key = `late-${id}-${bucket}`;
        notifyOnce(key, () =>
          toast.warn(
            `${tipoES} atrasada para ${resolveClientName(a)} (${fmt(when)})`,
            { autoClose: 10000, toastId: key }
          )
        );
        // No se marca en storage; volverá a alertar en el siguiente bucket
      }
    });
  };

  // Un único intervalo global (sin dependencias); también dispara al montar
  useEffect(() => {
    // si aún no tenemos los clientes, no dispares notificaciones
    if (!clientsMap || clientsMap.size === 0) return;

    const tick = () => checkNotifications(rowsRef.current);

    tick(); // primera pasada con clientes disponibles
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [clientsMap]); // se

  // Señales visuales para estado en la tabla
  const rowState = (a) => {
    const when = new Date(v(a, ["activityDate", "fechaActividad", "date", "createdAt"]) || "");
    if (isNaN(when)) return "";
    const now = new Date();
    const diffMin = (when.getTime() - now.getTime()) / 60000;
    if (isDone(a)) return "row-done";
    if (diffMin >= 0 && diffMin <= 15) return "row-soon";
    if (diffMin < 0 && diffMin >= -60) return "row-overdue";
    return "";
  };

  return (
    <div style={{
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Limito la concurrencia para evitar saturación visual */}
      <ToastContainer limit={3} />

      {/* Header moderno */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              color: '#374151',
              fontSize: '2rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🎯 Gestión de Actividades
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              Administra y programa las actividades de tus clientes
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {userName || userId ? (
              <div style={{
                background: '#f3f4f6',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                👤 <strong>{userName || "—"}</strong>
                {userId ? ` (ID ${userId})` : ""}
              </div>
            ) : (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                No identificado
              </div>
            )}

            <button
              style={{
                background: openForm ? '#ef4444' : '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              onClick={() => setOpenForm((v) => !v)}
            >
              {openForm ? "✕ Cerrar" : "➕ Nueva Actividad"}
            </button>
          </div>
        </div>
      </div>

      {openForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            color: '#374151',
            fontSize: '1.25rem',
            fontWeight: '600',
            borderBottom: '2px solid #8b5cf6',
            paddingBottom: '0.5rem'
          }}>
            {editId ? '✏️ Editar Actividad' : '➕ Nueva Actividad'}
          </h3>

          <form onSubmit={handleCreateOrUpdate}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  👤 Cliente *
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: editingIsDone ? '#f9fafb' : 'white'
                  }}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={editingIsDone}
                >
                  <option value="">— Seleccionar Cliente —</option>
                  {Array.isArray(clients) &&
                    clients.map((c) => {
                      const id = v(c, ["clientId", "idClient", "idCliente", "id"]);
                      const nit = v(c, ["nit", "nitCliente"]);
                      const first = v(c, ["firstName", "nombre", "name", "nombreCliente"]);
                      const last = v(c, ["lastName", "apellidoCliente"]);
                      const display =
                        [first, last].filter(Boolean).join(" ").trim() || (nit ? String(nit) : "Sin nombre");
                      return (
                        <option key={id ?? nit} value={id}>
                          {nit ? `${nit} — ` : ""}
                          {display}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  📋 Tipo de Actividad *
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: editingIsDone ? '#f9fafb' : 'white'
                  }}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  disabled={editingIsDone}
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  📅 Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: editingIsDone ? '#f9fafb' : 'white'
                  }}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  disabled={editingIsDone}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                📝 Descripción *
              </label>
              <textarea
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  background: editingIsDone ? '#f9fafb' : 'white'
                }}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe detalladamente la actividad a realizar..."
                disabled={editingIsDone}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                type="submit"
                disabled={formDisabled || saving}
                style={{
                  background: formDisabled || saving ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: formDisabled || saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!formDisabled && !saving) {
                    e.target.style.background = '#7c3aed';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!formDisabled && !saving) {
                    e.target.style.background = '#8b5cf6';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {saving ? "💾 Guardando..." : editId ? "✏️ Actualizar" : "💾 Guardar Actividad"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  ✕ Cancelar
                </button>
              )}

              {editingIsDone && (
                <div style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  ⚠️ Esta actividad ya está realizada
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          margin: '0 0 1.5rem 0',
          color: '#374151',
          fontSize: '1.25rem',
          fontWeight: '600',
          paddingBottom: '0.5rem'
        }}>
          📋 Lista de Actividades {rows.length > 0 && `(${rows.length})`}
        </h3>

        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: "100%", borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#8b5cf6', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>👤 Cliente</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📋 Tipo</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📝 Descripción</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>📅 Fecha</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', width: '280px' }}>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    🔄 Cargando actividades...
                  </td>
                </tr>
              )}
              {!loading && err && (
                <tr>
                  <td colSpan={5} style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    ❌ {err}
                  </td>
                </tr>
              )}
              {!loading && !err && rows.length === 0 && (
                <tr>
                  <td colSpan={5} style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '1.1rem'
                  }}>
                    📭 No hay actividades registradas
                  </td>
                </tr>
              )}
              {!loading &&
                !err &&
                rows.map((a) => {
                  const id = v(a, ["idActivity", "idActividad", "id"]);
                  const rawType = v(a, ["activityType", "tipoActividad", "type"]) || "NOTE";
                  const tipoES = TYPE_LABEL[rawType] || rawType;
                  const desc = v(a, ["description", "descripcion", "title"]) || "-";
                  const fecha = v(a, ["activityDate", "fechaActividad", "date", "createdAt"]);
                  const cname = resolveClientName(a);

                  const done = isDone(a);
                  const rclass = rowState(a);

                  // Determinar color de fondo basado en estado
                  let rowBg = 'white';
                  let borderColor = '#e5e7eb';
                  if (done) {
                    rowBg = '#f0fdf4';
                    borderColor = '#bbf7d0';
                  } else if (rclass === 'row-soon') {
                    rowBg = '#fef3c7';
                    borderColor = '#fde68a';
                  } else if (rclass === 'row-overdue') {
                    rowBg = '#fee2e2';
                    borderColor = '#fecaca';
                  }

                  return (
                    <tr
                      key={id}
                      style={{
                        background: rowBg,
                        transition: 'all 0.2s ease',
                        borderLeft: `4px solid ${borderColor}`
                      }}
                      onMouseOver={(e) => {
                        if (!done) {
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = rowBg;
                      }}
                    >
                      <td style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {cname}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: done ? '#f3f4f6' : getTypeColor(rawType).bg,
                          color: done ? '#6b7280' : getTypeColor(rawType).text
                        }}>
                          {tipoES}
                        </span>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb',
                        color: done ? '#6b7280' : '#374151'
                      }}>
                        {desc}
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb',
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>
                        {fmt(fecha)}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            style={{
                              background: done ? '#f3f4f6' : '#3b82f6',
                              color: done ? '#9ca3af' : 'white',
                              border: 'none',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: done ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (!done) {
                                e.target.style.background = '#2563eb';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!done) {
                                e.target.style.background = '#3b82f6';
                              }
                            }}
                            title="Editar actividad"
                            onClick={() => onEdit(a)}
                            disabled={done}
                          >
                            ✏️ Editar
                          </button>

                          <button
                            style={{
                              background: done ? '#f3f4f6' : '#ef4444',
                              color: done ? '#9ca3af' : 'white',
                              border: 'none',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: done ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (!done) {
                                e.target.style.background = '#dc2626';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!done) {
                                e.target.style.background = '#ef4444';
                              }
                            }}
                            title="Eliminar actividad"
                            onClick={() => onDelete(a)}
                            disabled={done}
                          >
                            🗑️ Eliminar
                          </button>

                          <button
                            style={{
                              background: done ? '#10b981' : 'white',
                              color: done ? 'white' : '#10b981',
                              border: `1px solid #10b981`,
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: done ? 'default' : 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (!done) {
                                e.target.style.background = '#10b981';
                                e.target.style.color = 'white';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!done) {
                                e.target.style.background = 'white';
                                e.target.style.color = '#10b981';
                              }
                            }}
                            title={done ? "Actividad completada" : "Marcar como realizada"}
                            onClick={() => !done && markDone(a)}
                            disabled={done}
                          >
                            {done ? "✅ Realizada" : "✓ Completar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
