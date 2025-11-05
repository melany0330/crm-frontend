// src/components/crm/ActivityQuickForm.jsx
import React, { useMemo, useState } from "react";
import { logActivity } from "../../core/system/activityLogger";

const TYPES = [
  { value: "CALL",       label: "Llamada" },
  { value: "MEETING",    label: "Reunión" },
  { value: "EMAIL",      label: "Email" },
  { value: "REMINDER",   label: "Recordatorio" },
  { value: "NOTE",       label: "Nota" },
];

function toLocalDateTimeString(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export default function ActivityQuickForm({ clientId, onCreated }) {
  const [tipo, setTipo] = useState("NOTE");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(() => toLocalDateTimeString(new Date()));
  const [saving, setSaving] = useState(false);
  const disabled = useMemo(() => !clientId || !tipo || !descripcion.trim(), [clientId, tipo, descripcion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    setSaving(true);
    try {
      await logActivity({
        clientId,
        tipo,
        descripcion,
        date: `${fecha}:00`, // agrega segundos
      });
      setDescripcion("");
      if (typeof onCreated === "function") onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label>
          <span style={{ display: "block", fontSize: 12, color: "#475569" }}>Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: "100%" }}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label>
          <span style={{ display: "block", fontSize: 12, color: "#475569" }}>Fecha y hora</span>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <label>
        <span style={{ display: "block", fontSize: 12, color: "#475569" }}>Descripción</span>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          placeholder="Descripción breve de la actividad…"
          style={{ width: "100%", resize: "vertical" }}
        />
      </label>

      <div>
        <button type="submit" disabled={disabled || saving} style={{ padding: "8px 12px" }}>
          {saving ? "Guardando…" : "Agregar actividad"}
        </button>
      </div>
    </form>
  );
}