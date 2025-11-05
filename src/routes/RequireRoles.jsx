import React from "react";
import { Navigate } from "react-router-dom";
import APIUtil from "../core/system/APIUtil";

export default function RequireRoles({ roles = [], children }) {
  const logged = APIUtil.validateSession?.() ?? false;
  if (!logged) return <Navigate to="/account" replace />;

  // Si no configuraste RoleUtil, deja pasar siempre:
  if (!APIUtil.hasAnyRole) return children;

  const ok = APIUtil.hasAnyRole(roles);
  if (!ok) return <Navigate to="/" replace />;

  return children;
}

