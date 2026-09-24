/*
  authorization.js
  ─────────────────────────────────────────────────────────────
  Two responsibilities in one file:

  1. API CLIENT — all fetch calls to the Express backend.
     Cookies (auth_token, device_id) are sent automatically
     because every call uses credentials: "include".

  2. ROUTE PERMISSION CHECKER — pure frontend logic that decides
     which nav links a logged-in user can see/visit.
     The backend enforces the same rules server-side; this just
     keeps the UI tidy (hides links the user can't reach).
  ─────────────────────────────────────────────────────────────
*/

// ── 1. API CLIENT ────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "https://campus-portal-backend-m59f.onrender.com/api";

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `Request failed (${res.status})`);
  }

  return res.json();
}

/** Check if this browser has a recognised device_id cookie */
export async function checkDevice() {
  return apiFetch("/auth/device-check");
}

/** Set the long-lived device_id cookie for a new device */
export async function registerDevice() {
  return apiFetch("/auth/register-device", { method: "POST" });
}

/** Full login: username + password + MFA code */
export async function login(username, password, mfaCode) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password, mfaCode }),
  });
}

/** Restore session from existing auth_token cookie */
export async function checkSession() {
  return apiFetch("/auth/me");
}

/** Clear the auth_token cookie server-side */
export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

/** Fetch data for the current user's role dashboard */
export async function fetchAdminPage()   { return apiFetch("/admin-page"); }
export async function fetchFacultyPage() { return apiFetch("/faculty-page"); }
export async function fetchStudentPage() { return apiFetch("/student-page"); }


// ── 2. ROUTE PERMISSION CHECKER ──────────────────────────────
//
//  The backend uses lowercase role strings ("admin", "faculty", "student").
//  The Layout/nav system uses UPPERCASE to match the zip's convention.
//  normaliseRole() bridges the two so nothing breaks either way.

function normaliseRole(role = "") {
  return role.toUpperCase();
}

const publicRoutes = ["/", "/about", "/academics", "/admissions", "/notices", "/events"];

const authenticatedRoutes = [
  "/dashboard", "/profile",
  "/courses", "/timetable", "/attendance",
  "/examinations", "/results", "/fees", "/library", "/documents",
];

const roleRoutes = {
  FACULTY: ["/faculty", "/faculty/classes", "/faculty/attendance", "/faculty/marks"],
  ADMIN:   ["/admin", "/admin/students", "/admin/courses", "/admin/announcements"],
};

export function getAccessTier(pathname) {
  if (publicRoutes.includes(pathname))   return 1;
  if (authenticatedRoutes.includes(pathname)) return 2;
  if (Object.values(roleRoutes).flat().includes(pathname)) return 3;
  return 0;
}

/**
 * Returns true if `user` is allowed to visit `pathname`.
 * `user` is the object returned by /me: { id, username, role, … }
 */
export function authorize(user, pathname) {
  const role = normaliseRole(user?.role);
  const tier = getAccessTier(pathname);

  if (tier === 0) return false;
  if (tier === 1) return true;
  if (tier === 2) return role !== "PUBLIC" && !!user;
  if (tier === 3) {
    if (role === "ADMIN") return true;
    return roleRoutes[role]?.includes(pathname) ?? false;
  }
  return false;
}

/** Human-readable label for the role chip in the topbar */
export function getRoleLabel(role = "") {
  return {
    PUBLIC:  "Visitor",
    STUDENT: "Student",
    FACULTY: "Faculty",
    ADMIN:   "Administrator",
  }[normaliseRole(role)] || "User";
}