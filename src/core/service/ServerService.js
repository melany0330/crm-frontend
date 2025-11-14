// src/core/service/ServerService.js
import axios from "axios";
import APIUtil from "../system/APIUtil";

const isBrowser = typeof window !== "undefined";

// ===== Config de base (Vite + fallback) =====
// En producción (Vercel), usar la URL de AWS directamente
// En desarrollo (Vite), usar el proxy
const BASE_URL = import.meta.env.VITE_API_URL || "";

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
  // 1) APIUtil si existe
  try {
    if (APIUtil && typeof APIUtil.getAuthUserName === "function") {
      const u = APIUtil.getAuthUserName();
      if (u) return u;
    }
  } catch { }
  // 2) localStorage guardado por tu AuthService
  if (isBrowser) {
    const u = localStorage.getItem("user");
    if (u) return u;
  }
  // 3) intenta del JWT (claims comunes: username, preferred_username)
  const t = getAuthToken();
  const p = t ? decodeJwtPayload(t) : null;
  return p?.username || p?.preferred_username || null;
}

export function getAuthUserId() {
  // 1) APIUtil si existe
  try {
    if (APIUtil && typeof APIUtil.getAuthUserId === "function") {
      const id = APIUtil.getAuthUserId();
      if (id) return Number(id);
    }
  } catch { }
  // 2) localStorage (si alguna vez lo guardaste)
  if (isBrowser) {
    const key =
      localStorage.getItem("userId") ||
      localStorage.getItem("idUser") ||
      localStorage.getItem("idUsuario");
    if (key) return Number(key);
  }
  // 3) intenta del JWT (claims comunes)
  const t = getAuthToken();
  const p = t ? decodeJwtPayload(t) : null;
  const guess = p?.id ?? p?.userId ?? p?.idUser ?? p?.idUsuario ?? p?.sub;
  return guess ? Number(guess) : null;
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

    // Debug log temporal para verificar URLs
    console.log(`🔍 ServerService Debug:`, {
      BASE_URL,
      originalUrl: url,
      finalUrl,
      hostname: isBrowser ? window.location.hostname : "no browser",
      env: import.meta.env.VITE_API_URL
    });

    return axios({ method, url: finalUrl, data, headers, ...config });
  }

  static #createHeaders(token, customHeaders) {
    const headers = { "Content-Type": "application/json", ...customHeaders };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }
}

export default ServerService;