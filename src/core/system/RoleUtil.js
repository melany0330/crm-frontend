import APIUtil from "./APIUtil";

export function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch { return {}; }
}

export function getUserRoles() {
  const t = APIUtil.getAuthToken?.();
  if (!t) return [];
  const p = decodeJwtPayload(t);
  // Ajusta la clave si tu backend usa otro claim
  return p.roles || p.authorities || p.scope || [];
}

export function hasAnyRole(wanted = []) {
  if (!wanted?.length) return true;
  const r = getUserRoles();
  const set = new Set(typeof r === "string" ? r.split(/\s+/) : r);
  return wanted.some((x) => set.has(x));
}
