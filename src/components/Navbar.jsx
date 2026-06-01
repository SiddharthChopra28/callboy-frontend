import React from "react";
import { STAGES } from "../constants";

export default function Navbar({ stage, statusColor, statusLabel }) {
  return (
    <nav style={{ height: 52, borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, background: "#0f2e1a", border: "1px solid #1a4d2a", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#f9fafb", letterSpacing: "-0.2px" }}>Talko</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: stage === STAGES.CALLING ? statusColor : "#22c55e", display: "inline-block", animation: stage === STAGES.CALLING ? "pulse 2s infinite" : "none" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase" }}>
          {stage === STAGES.CALLING ? statusLabel : stage === STAGES.SUMMARY ? "Done" : "Ready"}
        </span>
      </div>
    </nav>
  );
}
