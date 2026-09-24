import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";

import { Home, SimplePublic } from "./pages/PublicPages";
import {
  StudentDashboard, StudentTablePage,
  GenericStudentPage, Profile,
} from "./pages/StudentPages";
import {
  FacultyDashboard, FacultyPage,
  AdminDashboard, AdminPage,
} from "./pages/StaffPages";
import AccessDenied from "./pages/AccessDenied";

import {
  checkSession, logout,
  fetchStudentPage, fetchFacultyPage, fetchAdminPage,
  authorize,
} from "./auth/authorization";

// ── Route guard ───────────────────────────────────────────────
function Protected({ user, path, children }) {
  if (!authorize(user, path)) return <AccessDenied />;
  return children;
}

// ── All app routes ────────────────────────────────────────────
function AppRoutes({ user, pageData }) {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Protected user={user} path="/"><Home /></Protected>} />
      {["/about", "/academics", "/admissions", "/notices", "/events"].map(p => (
        <Route key={p} path={p} element={
          <Protected user={user} path={p}><SimplePublic type={p} /></Protected>
        } />
      ))}

      {/* Student — profile + dashboard */}
      <Route path="/dashboard" element={
        <Protected user={user} path="/dashboard">
          <StudentDashboard user={user} pageData={pageData} />
        </Protected>
      } />
      <Route path="/profile" element={
        <Protected user={user} path="/profile">
          <Profile user={user} pageData={pageData} />
        </Protected>
      } />

      {/* Student — table pages */}
      {["/courses", "/attendance", "/results", "/timetable"].map(p => (
        <Route key={p} path={p} element={
          <Protected user={user} path={p}>
            <StudentTablePage type={p} pageData={pageData} />
          </Protected>
        } />
      ))}

      {/* Student — service pages */}
      <Route path="/examinations" element={
        <Protected user={user} path="/examinations">
          <GenericStudentPage eyebrow="EXAMINATION CELL" title="Examinations" text="Examination registration, schedules and hall-ticket services." />
        </Protected>
      } />
      <Route path="/fees" element={
        <Protected user={user} path="/fees">
          <GenericStudentPage eyebrow="STUDENT ACCOUNTS" title="Fees & Dues" text="Fee status, payment records and institutional dues." />
        </Protected>
      } />
      <Route path="/library" element={
        <Protected user={user} path="/library">
          <GenericStudentPage eyebrow="CENTRAL LIBRARY" title="Library" text="Library catalogue, issued resources and due dates." />
        </Protected>
      } />
      <Route path="/documents" element={
        <Protected user={user} path="/documents">
          <GenericStudentPage eyebrow="STUDENT SERVICES" title="Documents" text="Bonafide certificates, transcripts and student service requests." />
        </Protected>
      } />

      {/* Faculty */}
      <Route path="/faculty" element={
        <Protected user={user} path="/faculty">
          <FacultyDashboard user={user} pageData={pageData} />
        </Protected>
      } />
      {["/faculty/classes", "/faculty/attendance", "/faculty/marks"].map(p => (
        <Route key={p} path={p} element={
          <Protected user={user} path={p}>
            <FacultyPage type={p} pageData={pageData} />
          </Protected>
        } />
      ))}

      {/* Admin */}
      <Route path="/admin" element={
        <Protected user={user} path="/admin">
          <AdminDashboard pageData={pageData} />
        </Protected>
      } />
      {["/admin/students", "/admin/courses", "/admin/announcements"].map(p => (
        <Route key={p} path={p} element={
          <Protected user={user} path={p}>
            <AdminPage type={p} pageData={pageData} />
          </Protected>
        } />
      ))}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── Root component ────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from existing auth_token cookie
  useEffect(() => {
    checkSession()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Fetch role-appropriate page data whenever the user changes
  useEffect(() => {
    if (!user) { setPageData(null); return; }

    const fetch = {
      admin:   fetchAdminPage,
      faculty: fetchFacultyPage,
      student: fetchStudentPage,
    }[user.role?.toLowerCase()];

    if (fetch) {
      fetch()
        .then(setPageData)
        .catch(() => setPageData(null));
    }
  }, [user]);

  async function handleLogout() {
    try { await logout(); } catch { /* ignore */ }
    setUser(null);
    setPageData(null);
  }

  // ── Loading splash ──
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg)",
      }}>
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--navy-dark)", color: "#fff",
            display: "grid", placeItems: "center",
            fontFamily: "Georgia,serif", fontSize: 26,
            margin: "0 auto 16px",
          }}>I</div>
          Restoring session…
        </div>
      </div>
    );
  }

  // ── Not logged in → Login page ──
  if (!user) {
    return <LoginPage onLoginSuccess={u => setUser(u)} />;
  }

  // ── Logged in → Full portal with Layout shell ──
  return (
    <Layout user={user} onLogout={handleLogout}>
      <AppRoutes user={user} pageData={pageData} />
    </Layout>
  );
}