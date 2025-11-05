// src/core/system/activityLogger.js
import ActivitiesService from "../../service/crm/activities.service";
import { getAuthUserId } from "../../core/service/ServerService";

function toLocalDateTimeString(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}

function getCurrentUserId() {
  // 1) intenta helper centralizado
  const fromHelper = getAuthUserId();
  if (fromHelper) return fromHelper;

  // 2) intenta localStorage "user" (si guardas JSON con datos)
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      return u?.idUser ?? u?.id ?? u?.userId ?? null;
    }
  } catch (_) {}

  // 3) llaves sueltas
  const sueltas =
    localStorage.getItem("userId") ||
    localStorage.getItem("idUser") ||
    localStorage.getItem("idUsuario");
  return sueltas ? Number(sueltas) : null;
}

export async function logActivity(p = {}) {
  const clientId = Number(p.clientId ?? p.idCliente);
  if (!clientId) return;

  const userId = Number(p.userId ?? getCurrentUserId());
  if (!userId) {
    console.warn("ActivityLogger: userId ausente; no se registrará actividad");
    return;
  }

  const activityDate =
    typeof p.date === "string" ? p.date : toLocalDateTimeString(p.date);

  const dto = {
    clientId,
    userId,
    activityType: p.tipo ?? "VENTA",
    description: p.descripcion ?? "Actividad generada desde frontend",
    activityDate,
  };

  try {
    await ActivitiesService.create(dto);
  } catch (e) {
    console.warn(
      "No se pudo registrar la actividad:",
      e?.response?.status,
      e?.response?.data || e.message
    );
  }
}

export async function logSale({ clientId, total, itemsCount }) {
  return logActivity({
    clientId,
    tipo: "VENTA",
    descripcion: `Venta por $${Number(total).toFixed(2)} con ${itemsCount} producto(s).`,
    date: new Date(),
  });
}
