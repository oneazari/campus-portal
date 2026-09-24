import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, AlertCircle, BookOpen } from "lucide-react";
import { Card, DataTable, PageHeader } from "../components/Page";

/*
  All components here receive `pageData` — the object returned by
  GET /student-page from your real backend.

  Current backend returns: { page: "student-page", access: "..." }
  As you expand the backend, add fields (courses, timetable, etc.)
  and update the destructuring below. Fallbacks keep it safe meanwhile.
*/

export function StudentDashboard({ user, pageData }) {
  const name = user?.name || user?.username || "Student";

  // These will be real arrays once your backend sends them.
  // Empty arrays = graceful empty state until then.
  const stats    = pageData?.stats    || [];
  const schedule = pageData?.timetable || [];
  const notices  = pageData?.notices  || [];
  const attendance = pageData?.attendance || [];

  return (
    <>
      <PageHeader
        eyebrow="STUDENT PORTAL"
        title={`Good day, ${name.split(" ")[0]}.`}
        description={pageData?.programme ? `${pageData.programme} · ${pageData.semester}` : "Student workspace"}
      />

      {/* Stat cards — shown only when backend provides them */}
      {stats.length > 0 && (
        <div className="stats-grid">
          {stats.map(([label, value, sub]) => (
            <div className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{sub}</small>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <Card title="Today's Schedule">
          {schedule.length > 0 ? (
            schedule.map(([time, subject, code, room]) => (
              <div className="schedule-row" key={time}>
                <b>{time}</b>
                <div>
                  <strong>{subject}</strong>
                  <span>{code} · {room}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 12 }}>
              Schedule will appear here once the backend provides timetable data.
            </p>
          )}
          <Link to="/timetable" className="text-link">
            View full timetable <ArrowRight size={15} />
          </Link>
        </Card>

        <Card title="Important Notices">
          {notices.length > 0 ? (
            notices.slice(0, 3).map(n => (
              <div className="notice-row" key={n.title}>
                <span className="date-box">{n.date}</span>
                <div>
                  <span className="tag">{n.tag}</span>
                  <strong>{n.title}</strong>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 12 }}>No notices at this time.</p>
          )}
          <Link to="/notices" className="text-link">
            View all notices <ArrowRight size={15} />
          </Link>
        </Card>
      </div>

      <div className="two-column">
        <Card title="Attendance Overview">
          {attendance.length > 0 ? (
            attendance.map(([name, pct, count]) => (
              <div className="progress-row" key={name}>
                <div><span>{name}</span><b>{pct}</b></div>
                <div className="progress"><i style={{ width: pct }} /></div>
                <small>{count} classes attended</small>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 12 }}>Attendance data not yet available.</p>
          )}
        </Card>

        <Card title="Quick Access">
          <div className="shortcut-grid">
            <Link to="/courses">      <BookOpen />    My Courses</Link>
            <Link to="/examinations"> <CalendarDays /> Examinations</Link>
            <Link to="/results">      <AlertCircle /> Results</Link>
            <Link to="/documents">    <BookOpen />    Documents</Link>
          </div>
        </Card>
      </div>
    </>
  );
}

export function StudentTablePage({ type, pageData }) {
  /*
    As the backend grows, pageData can carry arrays for each section.
    Keys below match what would be natural to return from the backend.
    Falls back to empty rows so the table still renders.
  */
  const configs = {
    "/courses": {
      eyebrow: "MY COURSES", title: "Registered Courses",
      desc: "Current semester course registrations.",
      columns: ["Code", "Course", "Faculty", "Credits"],
      rows: pageData?.courses || [],
    },
    "/attendance": {
      eyebrow: "ATTENDANCE", title: "Attendance Record",
      desc: "Subject-wise attendance for the current semester.",
      columns: ["Course", "Attendance", "Classes"],
      rows: pageData?.attendance || [],
    },
    "/results": {
      eyebrow: "ACADEMIC RECORD", title: "Results",
      desc: "Current semester results.",
      columns: ["Course", "Grade", "Grade Point"],
      rows: pageData?.results || [],
    },
    "/timetable": {
      eyebrow: "ACADEMIC SCHEDULE", title: "Timetable",
      desc: "Current semester class schedule.",
      columns: ["Time", "Course", "Code", "Room"],
      rows: pageData?.timetable || [],
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
              <div className="placeholder-icon"><BookOpen size={28} /></div>
              <h2>No data yet</h2>
              <p>This will populate once the backend returns {configs.title.toLowerCase()} data from the student-page endpoint.</p>
            </div>
        }
      </Card>
    </>
  );
}

export function GenericStudentPage({ title, eyebrow, text }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={text} />
      <Card>
        <div className="placeholder-large">
          <div className="placeholder-icon"><BookOpen size={28} /></div>
          <h2>Service placeholder</h2>
          <p>This service is available once the corresponding backend endpoint is connected.</p>
        </div>
      </Card>
    </>
  );
}

export function Profile({ user, pageData }) {
  const u = pageData?.profile || user || {};
  return (
    <>
      <PageHeader eyebrow="ACCOUNT" title="My Profile" description="Student identity and academic information." />
      <Card>
        <div className="profile-grid">
          <div><span>Student ID</span>   <strong>{u.id       || u.username || "—"}</strong></div>
          <div><span>Name</span>         <strong>{u.name     || u.username || "—"}</strong></div>
          <div><span>Programme</span>    <strong>{u.programme|| "—"}</strong></div>
          <div><span>Semester</span>     <strong>{u.semester || "—"}</strong></div>
          <div><span>Email</span>        <strong>{u.email    || "—"}</strong></div>
          <div><span>Role</span>         <strong>{u.role     || "—"}</strong></div>
        </div>
      </Card>
    </>
  );
}