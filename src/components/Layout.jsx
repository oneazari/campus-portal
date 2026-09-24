import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, CalendarDays, ClipboardCheck, GraduationCap,
  CreditCard, Library, FileText, Bell, Users, Settings, LogOut, Shield,
  Menu, X, Home, Megaphone, BarChart3,
} from "lucide-react";
import { authorize, getRoleLabel } from "../auth/authorization";

// ── Nav link definitions ──────────────────────────────────────
const publicLinks = [
  ["/",           "Home",             Home],
  ["/about",      "About Institute",  FileText],
  ["/academics",  "Academics",        GraduationCap],
  ["/admissions", "Admissions",       BookOpen],
  ["/notices",    "Notices",          Bell],
  ["/events",     "Events",           CalendarDays],
];

const studentLinks = [
  ["/dashboard",   "Dashboard",   LayoutDashboard],
  ["/courses",     "My Courses",  BookOpen],
  ["/timetable",   "Timetable",   CalendarDays],
  ["/attendance",  "Attendance",  ClipboardCheck],
  ["/examinations","Examinations",GraduationCap],
  ["/results",     "Results",     BarChart3],
  ["/fees",        "Fees & Dues", CreditCard],
  ["/library",     "Library",     Library],
  ["/documents",   "Documents",   FileText],
];

const facultyLinks = [
  ["/faculty",            "Faculty Dashboard", LayoutDashboard],
  ["/faculty/classes",    "My Classes",        Users],
  ["/faculty/attendance", "Attendance",        ClipboardCheck],
  ["/faculty/marks",      "Marks",             BarChart3],
];

const adminLinks = [
  ["/admin",                "Administration",    Shield],
  ["/admin/students",       "Student Management",Users],
  ["/admin/courses",        "Course Management", BookOpen],
  ["/admin/announcements",  "Announcements",     Megaphone],
];

// ── Link group renderer ───────────────────────────────────────
function Links({ links, user, close }) {
  return links
    .filter(([path]) => authorize(user, path))
    .map(([path, label, Icon]) => (
      <NavLink
        key={path}
        to={path}
        end={path === "/"}
        onClick={close}
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <Icon size={17} strokeWidth={1.8} />
        <span>{label}</span>
      </NavLink>
    ));
}

// ── Layout shell ──────────────────────────────────────────────
export default function Layout({ user, children, onLogout }) {
  const [open, setOpen] = useState(false);
  const role     = getRoleLabel(user?.role);
  // Display name: backend returns `username`; fall back gracefully
  const name     = user?.name || user?.username || "User";
  const initial  = name[0]?.toUpperCase() || "U";
  const normRole = (user?.role || "").toUpperCase();

  return (
    <div className="app-shell">
      {/* ── Topbar ── */}
      <header className="topbar">
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <div className="brand">
          <div className="crest">I</div>
          <div>
            <div className="brand-name">INSTITUTE OF TECHNOLOGY</div>
            <div className="brand-sub">Student &amp; Academic Portal</div>
          </div>
        </div>

        <div className="top-actions">
          <span className="role-chip">
            <Shield size={14} /> {role}
          </span>
          <button className="icon-btn" title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="portal-body">
        {/* Sidebar */}
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <div className="sidebar-user">
            <div className="avatar">{initial}</div>
            <div>
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
          </div>

          <nav className="nav-section">
            <div className="nav-heading">GENERAL</div>
            <Links links={publicLinks} user={user} close={() => setOpen(false)} />
          </nav>

          {normRole !== "PUBLIC" && (
            <nav className="nav-section">
              <div className="nav-heading">PORTAL</div>
              <Links links={studentLinks} user={user} close={() => setOpen(false)} />
            </nav>
          )}

          {normRole === "FACULTY" && (
            <nav className="nav-section">
              <div className="nav-heading">FACULTY</div>
              <Links links={facultyLinks} user={user} close={() => setOpen(false)} />
            </nav>
          )}

          {normRole === "ADMIN" && (
            <nav className="nav-section">
              <div className="nav-heading">ADMINISTRATION</div>
              <Links links={adminLinks} user={user} close={() => setOpen(false)} />
            </nav>
          )}

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <div className="content-wrap">{children}</div>
          <footer className="footer">
            <span>© 2026 Institute of Technology</span>
            <span>Campus Portal</span>
          </footer>
        </main>
      </div>
    </div>
  );
}