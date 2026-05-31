import React from "react";
import ElapsedTimer from "./ElapsedTimer";
import { STATUS_COLORS } from "../constants";

export default function CallingStage({ form, callStartTime, statusColor, statusLabel, statusHistory }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", animation: "fadeUp 0.3s ease both" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div className="panel" style={{ alignItems: "center", textAlign: "center", padding: "40px 32px", gap: 28, marginBottom: 14 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#0f2e1a", border: `2px solid ${statusColor}30`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `1px solid ${statusColor}20`, animation: "ping 2s ease-in-out infinite" }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>

          <div>
            <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.12em", color: "#4b5563", textTransform: "uppercase", fontWeight: 600 }}>Calling</p>
            <p style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 300, color: "#f9fafb", letterSpacing: "-0.5px", fontFamily: "'Georgia', serif" }}>{form.target_name}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{form.to_number}</p>
          </div>

          {callStartTime && <ElapsedTimer startTime={callStartTime} />}

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111", border: `1px solid ${statusColor}25`, borderRadius: 999, padding: "7px 16px" }}>
            <span style={{ position: "relative", width: 8, height: 8, display: "inline-flex" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: statusColor, opacity: 0.4, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor }} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: statusColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>{statusLabel}</span>
            <span style={{ fontSize: 11, color: "#374151" }}>· polling every 3s</span>
          </div>
        </div>

        <div className="panel" style={{ gap: 10 }}>
          <div className="section-header" style={{ marginBottom: 2 }}>Timeline</div>
          {statusHistory.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLORS[h.status] || "#6b7280", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#9ca3af", textTransform: "capitalize", flex: 1 }}>{h.status.replace("-", " ")}</span>
              <span style={{ fontSize: 11, color: "#374151" }}>{h.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
