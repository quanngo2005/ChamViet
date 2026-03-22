import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export type UserRole = "ADMIN" | "STAFF" | "SHIPPER" | "CUSTOMER" | string;

type JwtPayload = {
  sub?: string;
  role?: UserRole;
  roles?: UserRole[] | string[];
  authorities?: string[];
  exp?: number;
};

export type AuthUser = {
  id?: string;
  roles: UserRole[];
  token: string;
};

function readToken(): string | null {
  if (typeof window === "undefined") return null;

  const candidates = ["accessToken", "token", "authToken", "jwt"];
  for (const key of candidates) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return null;
}

function normalizeRoles(payload: JwtPayload): UserRole[] {
  if (payload.roles) {
    return Array.isArray(payload.roles) ? (payload.roles as UserRole[]) : [String(payload.roles)];
  }

  if (payload.role) return [payload.role];

  if (payload.authorities?.length) return payload.authorities;

  return [];
}

function isExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function useRole() {
  const token = readToken();

  const user = useMemo<AuthUser | null>(() => {
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (isExpired(payload)) return null;

      return {
        id: payload.sub,
        roles: normalizeRoles(payload),
        token
      };
    } catch {
      return null;
    }
  }, [token]);

  const hasRole = (allowedRoles?: UserRole | UserRole[]) => {
    if (!allowedRoles) return true;
    if (!user) return false;

    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return allowed.some((role) => user.roles.includes(role));
  };

  return { user, loading: false, hasRole };
}

