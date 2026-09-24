Secure Institutional Campus Portal

A web-based campus portal built around Zero Trust Network Access (ZTNA) principles.

Instead of assuming that a user should be trusted simply because they have logged in, the portal checks several factors before granting access — including their role, registered device, authentication status, and network location.

The project demonstrates how these security controls can work together in a realistic institutional portal.

---

What does it do?

The portal provides different levels of access depending on who the user is:

- Public — Access to publicly available campus information.
- Student — Access to student-specific services and information.
- Faculty — Access to faculty services and resources.
- Admin — Access to administrative functions.

Access is not determined by the frontend alone. The backend also validates authentication and authorization before allowing protected requests.

---

Security Features

🔐 Role-Based Access Control

Users are assigned an access tier:

Public → Student → Faculty → Admin

Each tier has its own permissions and dashboard.

The backend checks the user's role before allowing access to protected resources, rather than relying only on frontend route restrictions.

💻 Device Registration

Before authenticating, a user must have a registered browser/device.

The application maintains a device identifier using a long-lived "httpOnly" cookie. This allows the backend to associate future authentication attempts with a previously registered device.

🔑 Multi-Factor Authentication

Logging in requires multiple pieces of information:

1. Username
2. Password
3. Six-digit MFA verification code

This provides an additional authentication step beyond the username and password.

🌍 Geographic Access Restriction

The backend checks the incoming IP address and applies a geographic access policy.

For this project, access is restricted to the Kerala region.

«Note: IP-based geolocation is inherently approximate and should not be treated as a precise physical-location verification mechanism.»

🍪 Secure Authentication Sessions

After successful authentication, the server creates a JWT-based session.

The JWT is stored in an "httpOnly" and "SameSite" cookie rather than being directly exposed to frontend JavaScript.

Sessions are configured with an 8-hour lifetime.

These cookie settings help reduce the risk of certain client-side credential/session attacks, although they do not by themselves make a session completely secure.

---

How the Authentication Flow Works

The basic flow is:

User
  │
  ▼
Device Registration
  │
  ▼
Username + Password
  │
  ▼
MFA Verification
  │
  ▼
IP / Location Check
  │
  ▼
JWT Session Created
  │
  ▼
Role & Permission Check
  │
  ▼
Protected Campus Portal

The important idea is that authentication and authorization are separate steps.

Being logged in does not automatically mean that a user can access every part of the portal.

---

Tech Stack

Backend

- Node.js
- Express
- JWT — Authentication sessions
- bcryptjs — Password hashing
- cookie-parser — Cookie handling
- CORS — Cross-origin request handling
- UUID — Unique identifiers
- Modular structure using:
  - Controllers
  - Middleware
  - Services
  - Utilities
  - Configuration

Frontend

- React 18
- Vite
- React Router v7
- Lucide React — Icons
- Custom Navy & Gold institutional design system

---

Project Structure

campus-portal/
│
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration and constants
│   │   ├── controllers/     # Authentication and page handlers
│   │   ├── middleware/      # Authentication and role checks
│   │   ├── services/        # IP/location enforcement
│   │   ├── utils/           # User store and supporting utilities
│   │   ├── app.js           # Express application and routes
│   │   └── server.js        # Server startup
│   │
│   └── package.json
│
├── src/
│   ├── auth/                # Authorization API and session state
│   ├── components/          # Reusable UI components
│   ├── pages/               # Portal pages and dashboards
│   ├── App.jsx              # Application entry and routes
│   └── styles.css           # Global styling
│
├── index.html
├── netlify.toml             # Netlify deployment configuration
└── package.json

---

Project Goal

This project is primarily a ZTNA/security architecture demonstration rather than a production-ready campus management system.

The goal is to demonstrate how multiple security controls can be combined to create a trust-aware access gateway:

«Identity + Device + Authentication + Context + Authorization → Access Decision»

The project can therefore serve as a foundation for experimenting with more advanced Zero Trust concepts such as continuous risk assessment, device posture checks, behavioral analysis, and adaptive access policies.

---

Current Limitations

This project uses simplified components for demonstration purposes.

For example:

- The user store is currently in-memory rather than a production database.
- IP geolocation is not equivalent to physical location verification.
- Device registration is implemented at the browser/device level and should not be treated as unbreakable hardware identity.
- MFA implementation is intended for demonstration rather than production deployment.
- JWT authentication alone does not constitute a complete Zero Trust implementation.

A production deployment would require additional controls such as secure secret management, persistent identity storage, HTTPS enforcement, rate limiting, audit logging, key rotation, device posture verification, and stronger MFA mechanisms.

---

Why ZTNA?

Traditional access control often follows a simple model:

Log in → You're inside

This project follows a more Zero Trust-oriented model:

Who are you?
      +
What device are you using?
      +
Have you completed MFA?
      +
Where is the request coming from?
      +
What are you authorized to access?
      ↓
Make an access decision

The core principle is simple:

Do not automatically trust a request just because authentication succeeded.