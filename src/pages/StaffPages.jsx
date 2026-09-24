import React from "react";
import { Users, BarChart3, Shield, BookOpen } from "lucide-react";
import { Card, DataTable, PageHeader } from "../components/Page";

/*
  Faculty and Admin pages.
  `pageData` = response from GET /faculty-page or /admin-page.

  Current backend returns: { page: "...", access: "..." }
  Extend your pageController.js to add real arrays and they'll
  automatically appear here — no frontend changes needed.
*/

// ── FACULTY ──────────────────────────────────────────────────

export function FacultyDashboard({ user, pageData }) {
  const name    = user?.name || user?.username || "Faculty";
  const classes = pageData?.classes || [];

  const quickStats = [
    ["Classes",       pageData?.classCount    ?? classes.length ?? "—", "Active teaching assignments"],
    ["Students",      pageData?.studentCount  ?? "—",                   "Across assigned classes"],
    ["Pending Marks", pageData?.pendingMarks  ?? "—",                   "Entries requiring attention"],
    ["Notices",       pageData?.noticeCount   ?? "—",                   "Department updates"],
  ];

  return (
    <>
      <PageHeader
        eyebrow="FACULTY PORTAL"
        title={`Welcome, ${name}.`}
        description={pageData?.department ? `${pageData.department} · Faculty workspace` : "Faculty workspace"}
      />

      <div className="stats-grid">
        {quickStats.map(([label, value, sub]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>

      <Card title="My Classes">
        {classes.length > 0
          ? <DataTable columns={["Code", "Course", "Semester", "Enrollment"]} rows={classes} />
          : <div className="placeholder-large">
              <div className="placeholder-icon"><Users size={28} /></div>
              <h2>No classes yet</h2>
              <p>Class data will appear once the backend returns it from the faculty-page endpoint.</p>
            </div>
        }
      </Card>
    </>
  );
}

export function FacultyPage({ type, pageData }) {
  const configs = {
    "/faculty/classes": {
      eyebrow: "TEACHING", title: "My Classes",
      desc: "Assigned teaching sections for the current semester.",
      columns: ["Code", "Course", "Semester", "Enrollment"],
      rows: pageData?.classes || [],
    },
    "/faculty/attendance": {
      eyebrow: "FACULTY SERVICE", title: "Attendance Management",
      desc: "Review and manage attendance for assigned courses.",
      columns: ["Course", "Students", "Status"],
      rows: pageData?.attendanceSummary || [],
    },
    "/faculty/marks": {
      eyebrow: "FACULTY SERVICE", title: "Marks Management",
      desc: "Review internal assessment and examination marks.",
      columns: ["Course", "Entries", "Status"],
      rows: pageData?.marksSummary || [],
    },
  }[type];

  if (!configs) return null;

  return (
    <>
      <PageHeader eyebrow={configs.eyebrow} title={configs.title} description={configs.desc} />
      <Card>
        {configs.rows.length > 0
          ? <DataTable columns={configs.columns} rows={configs.rows} />
          : <div className="placeholder-large">
              <div className="placeholder-icon"><BarChart3 size={28} /></div>
              <h2>No data yet</h2>
              <p>This will populate once the backend returns data for this section.</p>
            </div>
        }
      </Card>
    </>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────

export function AdminDashboard({ pageData }) {
  const stats = pageData?.stats || [];

  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Administration Dashboard"
        description="Institute-wide academic and portal administration."
      />

      {stats.length > 0 && (
        <div className="stats-grid">
          {stats.map(([label, value]) => (
            <div className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>Current portal record</small>
            </div>
          ))}
        </div>
      )}

      <div className="two-column">
        <Card title="Administrative Modules">
          <div className="admin-modules">
            <div><Users /><b>Student Management</b><span>Profiles, enrolment and academic records</span></div>
            <div><BookOpen /><b>Course Management</b><span>Courses, sections and faculty assignments</span></div>
            <div><Shield /><b>Access Control</b><span>Roles and portal permissions</span></div>
          </div>
        </Card>

        <Card title="System Status">
          <div className="status-line"><i /> Portal services operational</div>
          <div className="status-line"><i /> Academic data synchronised</div>
          <div className="status-line"><i /> Notification service operational</div>
          <div className="status-line"><i /> Kerala region enforcement active</div>
        </Card>
      </div>
    </>
  );
}

export function AdminPage({ type, pageData }) {
  const configs = {
    "/admin/students": {
      eyebrow: "ADMINISTRATION", title: "Student Management",
      desc: "Manage institute student records.",
      columns: ["ID", "Student", "Programme", "Status"],
      rows: pageData?.students || [],
    },
    "/admin/courses": {
      eyebrow: "ADMINISTRATION", title: "Course Management",
      desc: "Manage academic course records.",
      columns: ["Code", "Course", "Department", "Credits"],
      rows: pageData?.courses || [],
    },
    "/admin/announcements": {
      eyebrow: "ADMINISTRATION", title: "Announcements",
      desc: "Manage official portal announcements.",
      columns: ["Date", "Title", "Category", "Status"],
      rows: pageData?.announcements || [],
    },
  }[type];

  if (!configs) return null;

  return (
    <>
      <PageHeader eyebrow={configs.eyebrow} title={configs.title} description={configs.desc} />
      <Card>
        {configs.rows.length > 0
          ? <DataTable columns={configs.columns} rows={configs.rows} />
          : <div className="placeholder-large">
              <div className="placeholder-icon"><Shield size={28} /></div>
              <h2>No data yet</h2>
              <p>This table will populate once your admin-page endpoint returns the relevant records.</p>
            </div>
        }
      </Card>
    </>
  );
}