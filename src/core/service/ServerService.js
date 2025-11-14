import axios from "axios";
import APIUtil from "../system/APIUtil";

const isBrowser = typeof window !== "undefined";

// Determinar BASE_URL según el entorno
const BASE_URL = (() => {
  // En desarrollo (Vite dev server) - usar proxy
  if (import.meta.env.DEV) {
    return ""; // Usa el proxy de Vite
  }

  // En producción - siempre usar path relativo para Vercel rewrites
  if (import.meta.env.PROD) {
    return ""; // Usa los rewrites de Vercel
  }

  return "";
})();

// ===== Helpers de autenticación =====
export function getAuthToken() {
  try {
    if (APIUtil && typeof APIUtil.getAuthToken === "function") {
      const t = APIUtil.getAuthToken();
      if (t) return t;
    }
  } catch { }
  if (!isBrowser) return null;
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function getAuthUserName() {
  try {
    if (APIUtil && typeof APIUtil.getAuthUserName === "function") {
      const u = APIUtil.getAuthUserName();
      if (u) return u;
    }
  } catch { }
  if (isBrowser) {
    const u = localStorage.getItem("user");
    if (u) return u;
  }
  const t = getAuthToken();
  const p = t ? decodeJwtPayload(t) : null;
  return p?.sub || p?.username || p?.preferred_username || null;
}

export function getAuthUserId() {
  try {
    if (APIUtil && typeof APIUtil.getAuthUserId === "function") {
      const id = APIUtil.getAuthUserId();
      if (id) return Number(id);
    }
  } catch { }
  if (isBrowser) {
    const key =
      localStorage.getItem("userId") ||
      localStorage.getItem("idUser") ||
      localStorage.getItem("idUsuario");
    if (key) return Number(key);
  }
  const t = getAuthToken();
  const p = t ? decodeJwtPayload(t) : null;

  // Tu JWT usa "jti" para el ID (en binario)
  if (p?.jti) {
    try {
      return parseInt(p.jti, 2); // Convertir de binario a decimal
    } catch {
      return null;
    }
  }

  const guess = p?.id ?? p?.userId ?? p?.idUser ?? p?.idUsuario ?? p?.sub;
  return guess ? Number(guess) : null;
}

export function getAuthUserRole() {
  const t = getAuthToken();
  const p = t ? decodeJwtPayload(t) : null;

  // Tu JWT usa "ri" para el role ID (en binario)
  if (p?.ri) {
    try {
      return parseInt(p.ri, 2); // Convertir de binario a decimal
    } catch {
      return null;
    }
  }

  return p?.role || p?.roleId || null;
}

// ===== Servicio HTTP =====
class ServerService {
  authSend(url, method = "GET", data = null, customHeaders = {}, config = {}) {
    const token = getAuthToken();
    return this.send(url, method, token, data, customHeaders, config);
  }

  send(
    url,
    method = "GET",
    token = null,
    data = null,
    customHeaders = {},
    config = {}
  ) {
    const headers = ServerService.#createHeaders(token, customHeaders);
    const finalUrl = `${BASE_URL}${url}`;

    console.log(`🔍 Request Debug:`, {
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      method,
      originalUrl: url,
      finalUrl,
      BASE_URL,
      hasToken: !!token,
      hostname: isBrowser ? window.location.hostname : "no browser",
      viteApiUrl: import.meta.env.VITE_API_URL
    });

    return axios({
      method,
      url: finalUrl,
      data,
      headers,
      withCredentials: true, // Importante para CORS con credentials
      ...config
    });
  }

  static #createHeaders(token, customHeaders) {
    const headers = { "Content-Type": "application/json", ...customHeaders };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }
}

export default ServerService;