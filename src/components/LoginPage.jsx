import React, { useState, useEffect } from "react";
import { Shield, Lock, User, KeyRound, Monitor, AlertCircle, CheckCircle } from "lucide-react";
import { checkDevice, registerDevice, login } from "../auth/authorization";

export default function LoginPage({ onLoginSuccess }) {
  const [deviceState, setDeviceState] = useState({ loading: true, recognized: false, message: "" });
  const [form, setForm]               = useState({ username: "", password: "", mfaCode: "" });
  const [error, setError]             = useState("");
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => { verifyDevice(); }, []);

  async function verifyDevice() {
    setDeviceState({ loading: true, recognized: false, message: "" });
    try {
      const res = await checkDevice();
      setDeviceState({ loading: false, recognized: res.recognized, message: res.message || "" });
    } catch {
      setDeviceState({ loading: false, recognized: false, message: "Backend unreachable. Is the server running?" });
    }
  }

  async function handleRegisterDevice() {
    setSubmitting(true);
    setError("");
    try {
      await registerDevice();
      await verifyDevice();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await login(form.username, form.password, form.mfaCode);
      onLoginSuccess?.(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading ──
  if (deviceState.loading) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand">
            <div className="crest" style={{ margin: "0 auto 14px", width: 52, height: 52, fontSize: 28 }}>I</div>
            <div className="brand-name" style={{ color: "var(--navy)", textAlign: "center" }}>INSTITUTE OF TECHNOLOGY</div>
          </div>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 18 }}>
            Verifying device credentials…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="crest" style={{ background: "var(--navy-dark)", color: "#fff", margin: "0 auto 14px", width: 52, height: 52, fontSize: 28, border: "none" }}>I</div>
          <div className="brand-name" style={{ color: "var(--navy)", textAlign: "center", letterSpacing: ".08em" }}>INSTITUTE OF TECHNOLOGY</div>
          <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 11, marginTop: 4 }}>Student &amp; Academic Portal</div>
        </div>

        <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }} />

        {/* Error */}
        {error && (
          <div className="login-alert login-alert--error">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Unrecognised device */}
        {!deviceState.recognized ? (
          <div>
            <div className="login-alert login-alert--warn">
              <Monitor size={14} /> Unrecognised Device
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, margin: "12px 0 18px" }}>
              {deviceState.message || "This browser is not registered. Register it below before signing in."}
            </p>
            <button
              className="login-btn"
              onClick={handleRegisterDevice}
              disabled={submitting}
            >
              {submitting ? "Registering…" : "Register This Device"}
            </button>
          </div>
        ) : (
          /* Recognised device — full login form */
          <form onSubmit={handleSubmit}>
            <div className="login-alert login-alert--ok">
              <CheckCircle size={14} /> Device verified
            </div>

            <div className="login-field">
              <label><User size={11} /> Username or Email</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. student, faculty, admin"
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label><Lock size={11} /> Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label><KeyRound size={11} /> MFA Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={form.mfaCode}
                onChange={e => setForm({ ...form, mfaCode: e.target.value })}
                placeholder="6-digit code"
                className="login-input"
              />
            </div>

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? "Authenticating…" : <><Shield size={14} /> Sign In</>}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: 10, color: "#a0adb5", marginTop: 20 }}>
          Access restricted to authorised personnel · Kerala region only
        </p>
      </div>
    </div>
  );
}