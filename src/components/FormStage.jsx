import React from "react";

export default function FormStage({ form, errors, loading, handleChange, handleSubmit, hidePhone = false, verifiedNumber = "", onChangeNumber }) {
  return (
    <div style={{ flex: 1, padding: "44px 28px 40px", maxWidth: 1060, width: "100%", margin: "0 auto", animation: "fadeUp 0.3s ease both" }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#374151", textTransform: "uppercase" }}>Agent Configuration</p>
        <h1 style={{ margin: "0 0 10px", fontSize: 48, fontWeight: 300, color: "#f9fafb", lineHeight: 1.1, letterSpacing: "-1px", fontFamily: "'Georgia', serif" }}>Launch a Call</h1>
        <p style={{ margin: 0, fontSize: 14, color: "#4b5563" }}>Configure your AI voice agent and place the call instantly.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, alignItems: "start" }}>
        <div className="panel">
          <div className="section-header"><span className="section-dot" />Target</div>
          {hidePhone ? (
            <div>
              <div className="field-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                Verified Number
              </div>
              <div className="ad-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, color: "#9ca3af" }}>
                <span>{verifiedNumber}</span>
                {onChangeNumber && (
                  <button
                    type="button"
                    onClick={onChangeNumber}
                    style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#6b7280", fontSize: 11, padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="field-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                Phone Number
              </div>
              <input className={`ad-input${errors.to_number ? " err" : ""}`} type="tel" placeholder="+91 9341419041" value={form.to_number} onChange={e => handleChange("to_number", e.target.value)} />
            </div>
          )}
          <div>
            <div className="field-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Target Name
            </div>
            <input className={`ad-input${errors.target_name ? " err" : ""}`} type="text" placeholder="John Doe" value={form.target_name} onChange={e => handleChange("target_name", e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="panel">
            <div className="section-header"><span className="section-dot" />Agent Settings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
              <div>
                <div className="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 10-16 0"/></svg>
                  Agent Persona
                </div>
                <input className={`ad-input${errors.agent_persona ? " err" : ""}`} type="text" placeholder="Friendly sales representative from Amazon..." value={form.agent_persona} onChange={e => handleChange("agent_persona", e.target.value)} />
              </div>
              <div>
                <div className="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Objective
                </div>
                <input className={`ad-input${errors.objective ? " err" : ""}`} type="text" placeholder="Ask user about their experience with Amazon..." value={form.objective} onChange={e => handleChange("objective", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  Constraints
                </div>
                <textarea className="ad-input" rows={2} placeholder="Be polite, focus on reviews of the platform rather than individual products..." value={form.constraints} onChange={e => handleChange("constraints", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Opening Message
                </div>
                <textarea className="ad-input" rows={2} placeholder="Optional" value={form.opening_msg} onChange={e => handleChange("opening_msg", e.target.value)} />
              </div>
            </div>
          </div>

          <button className="launch-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><span style={{ width: 14, height: 14, border: "1.5px solid #444", borderTop: "1.5px solid #9ca3af", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Initiating Call…</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Launch Agent</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
