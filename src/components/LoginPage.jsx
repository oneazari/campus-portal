import React, { useState } from "react";
import { Shield, Lock, User, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { login } from "../auth/authorization";

export default function LoginPage({ onLoginSuccess }) {
  const [form, setForm]               = useState({ username: "", password: "", mfaCode: "" });
  const [error, setError]             = useState("");
  const [submitting, setSubmitting]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Location access is required to sign in.");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, () => {
          reject(new Error("Could not determine your device location. Please allow location access and try again."));
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const res = await login(form.username, form.password, form.mfaCode, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      onLoginSuccess?.(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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

        <form onSubmit={handleSubmit}>
            <div className="login-alert login-alert--ok">
              <CheckCircle size={14} /> Login verifies this device before trusting it
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

        <p style={{ textAlign: "center", fontSize: 10, color: "#a0adb5", marginTop: 20 }}>
          Access restricted to authorised personnel · Kerala region only
        </p>
      </div>
    </div>
  );
}