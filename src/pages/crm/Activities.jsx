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
    <div className="crm-wrap nice-font">
      {/* Limito la concurrencia para evitar saturación visual */}
      <ToastContainer limit={3} />

      <div className="crm-header">
        <h2>Actividades</h2>
        <div className="crm-user">
          {userName || userId ? (
            <span>
              Usuario: <b>{userName || "—"}</b>
              {userId ? ` (ID ${userId})` : ""}
            </span>
          ) : (
            <span>No identificado</span>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => setOpenForm((v) => !v)}>
            {openForm ? "Cerrar" : "Agregar actividad"}
          </button>
        </div>
      </div>

      {openForm && (
        <form className="card elevated" onSubmit={handleCreateOrUpdate}>
          <div className="grid-3">
            <label className="field">
              <span>Cliente</span>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={editingIsDone}
              >
                <option value="">— Seleccionar —</option>
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
            </label>

            <label className="field">
              <span>Tipo</span>
              <select
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
            </label>

            <label className="field">
              <span>Fecha y hora</span>
              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                disabled={editingIsDone}
              />
            </label>
          </div>

          <label className="field">
            <span>Descripción</span>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve de la actividad…"
              disabled={editingIsDone}
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={formDisabled || saving} className="btn btn-black">
              {saving ? "Guardando…" : editId ? "Actualizar" : "Guardar actividad"}
            </button>

            {editId && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancelar edición
              </button>
            )}

            {(formDisabled && !editingIsDone) && (
              <span className="hint">
                
              </span>
            )}
            {editingIsDone && <span className="hint">Esta actividad ya está realizada.</span>}
          </div>
        </form>
      )}

      <div className="table-wrap elevated">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Título / Descripción</th>
              <th>Fecha</th>
              <th style={{ width: 260, textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5}>Cargando…</td>
              </tr>
            )}
            {!loading && err && (
              <tr>
                <td colSpan={5} style={{ color: "crimson" }}>
                  {err}
                </td>
              </tr>
            )}
            {!loading && !err && rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No hay actividades.
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

                return (
                  <tr key={id} className={rclass}>
                    <td className="cell-strong">{cname}</td>
                    <td>
                      <span className={`tag ${done ? "tag-muted" : ""}`}>{tipoES}</span>
                    </td>
                    <td>{desc}</td>
                    <td>{fmt(fecha)}</td>
                    <td className="row-actions">
                      <div className="action-group">
                        <button
                          className="btn chip btn-black"
                          title="Editar"
                          onClick={() => onEdit(a)}
                          disabled={done}
                        >
                          Editar
                        </button>
                        <button
                          className="btn chip btn-black"
                          title="Eliminar"
                          onClick={() => onDelete(a)}
                          disabled={done}
                        >
                          Eliminar
                        </button>
                        <button
                          className={`btn chip ${done ? "btn-outline disabled" : "btn-outline"}`}
                          title="Marcar como realizado"
                          onClick={() => !done && markDone(a)}
                          disabled={done}
                        >
                          {done ? "Realizada" : "Marcar hecho"}
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
  );
}
