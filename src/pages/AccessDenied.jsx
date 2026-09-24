import React from "react";
import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="denied">
      <div className="denied-icon">
        <ShieldOff size={32} />
      </div>
      <h1>Access Denied</h1>
      <p>
        You don't have permission to view this page. If you believe this is an
        error, contact the portal administrator.
      </p>
      <Link to="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
}