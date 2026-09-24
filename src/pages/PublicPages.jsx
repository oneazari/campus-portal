import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Bell, GraduationCap } from "lucide-react";
import { Card, PageHeader } from "../components/Page";

// Static notices shown on the public homepage.
// Replace with a real /api/notices fetch when that endpoint exists.
const staticNotices = [
  { date: "23 Sep", tag: "Academic",    title: "End-semester registration window is now open." },
  { date: "21 Sep", tag: "Examination", title: "Mid-semester examination timetable published." },
  { date: "18 Sep", tag: "Campus",      title: "Annual technical symposium registrations opened." },
];

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow light">ACADEMIC YEAR 2026–27</div>
          <h1>Welcome to the<br /><span>Institute Campus Portal</span></h1>
          <p>One place for academic services, campus information, examinations, notices and student resources.</p>
          <div className="hero-actions">
            <Link to="/academics"  className="btn btn-light">Explore Academics <ArrowRight size={16} /></Link>
            <Link to="/notices"    className="btn btn-outline-light">View Notices</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-label">CAMPUS NOTICE</div>
          <strong>End-semester registration is now open.</strong>
          <span>Review your course selections before the published deadline.</span>
          <Link to="/notices">Read announcement →</Link>
        </div>
      </section>

      <div className="quick-grid">
        <Link to="/academics" className="quick-card"><GraduationCap /><span><b>Academics</b><small>Programmes &amp; departments</small></span><ArrowRight /></Link>
        <Link to="/notices"   className="quick-card"><Bell /><span><b>Notices</b><small>Official announcements</small></span><ArrowRight /></Link>
        <Link to="/events"    className="quick-card"><CalendarDays /><span><b>Campus Events</b><small>What's happening</small></span><ArrowRight /></Link>
      </div>

      <div className="two-column">
        <Card title="Latest Notices">
          <div className="notice-list">
            {staticNotices.map(n => (
              <div className="notice-row" key={n.title}>
                <span className="date-box">{n.date}</span>
                <div><span className="tag">{n.tag}</span><strong>{n.title}</strong></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="About the Portal">
          <p className="body-copy">
            The campus portal brings student-facing academic and administrative services into a
            single interface, protected by device recognition, MFA and Kerala-region access control.
          </p>
          <Link to="/about" className="text-link">Learn more <ArrowRight size={15} /></Link>
        </Card>
      </div>
    </>
  );
}

export function SimplePublic({ type }) {
  const content = {
    "/about":      ["ABOUT THE INSTITUTE", "About the Institute",    "A technology-focused academic institution committed to teaching, research and innovation."],
    "/academics":  ["ACADEMICS",           "Academic Programmes",    "Explore departments, programmes, courses and academic resources."],
    "/admissions": ["ADMISSIONS",          "Admissions",             "Information about undergraduate, postgraduate and doctoral admissions."],
    "/notices":    ["OFFICIAL COMMUNICATION","Notices & Announcements","The latest academic and campus notices published by the institute."],
    "/events":     ["CAMPUS LIFE",         "Events & Activities",    "Technical, cultural, academic and student-community activities across campus."],
  }[type];

  return (
    <>
      <PageHeader eyebrow={content[0]} title={content[1]} description={content[2]} />
      <Card>
        <div className="placeholder-large">
          <div className="placeholder-icon"><GraduationCap size={28} /></div>
          <h2>Content coming soon</h2>
          <p>This section will be populated once the relevant backend endpoints are connected.</p>
        </div>
      </Card>
    </>
  );
}