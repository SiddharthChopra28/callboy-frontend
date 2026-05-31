import React from "react";

export default function SummaryStage({ form, summaryLoading, summary, reset }) {
  console.log(summary)
  const transcript = summary?.chat_history;
  const normalizeRole = (line) => {
    const raw = (line.type || line.role || line.speaker || line.from || line.author || "").toLowerCase();
    if (["system"].includes(raw)) return "system";
    if (["ai", "assistant", "agent", "bot"].includes(raw)) return "ai";
    if (["human", "user"].includes(raw)) return "human";
    return raw || "human";
  };
  return (
    <div style={{ flex: 1, padding: "44px 28px 60px", maxWidth: 860, width: "100%", margin: "0 auto", animation: "fadeUp 0.3s ease both" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#374151", textTransform: "uppercase" }}>Call Complete</p>
          <h1 style={{ margin: "0 0 4px", fontSize: 36, fontWeight: 300, color: "#f9fafb", letterSpacing: "-0.5px", fontFamily: "'Georgia', serif" }}>{form.target_name}</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{form.to_number}</p>
        </div>
        <button className="new-call-btn" onClick={reset}>+ New Call</button>
      </div>

      {summaryLoading ? (
        <div className="panel" style={{ alignItems: "center", padding: "50px 20px", gap: 14 }}>
          <div style={{ width: 24, height: 24, border: "1.5px solid #1e1e1e", borderTop: "1.5px solid #22c55e", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>Fetching call summary…</p>
        </div>
      ) : summary?.error ? (
        <div className="panel" style={{ borderColor: "#7f1d1d" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>⚠ {summary.error}</p>
        </div>
      ) : summary ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {summary.summary && (
            <div className="panel">
              <div className="section-header"><span className="section-dot" />Summary</div>
              <p style={{ margin: 0, fontSize: 14, color: "#9ca3af", lineHeight: 1.75 }}>{summary.summary}</p>
            </div>
          )}

          {(summary.duration || summary.sentiment || summary.outcome) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[["Duration", summary.duration], ["Sentiment", summary.sentiment], ["Outcome", summary.outcome]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="panel" style={{ gap: 6 }}>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.12em", color: "#374151", textTransform: "uppercase", fontWeight: 600 }}>{k}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#e5e7eb" }}>{v}</p>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(transcript) && transcript.length > 0 && (
            <div className="panel" style={{ gap: 0 }}>
              <div className="section-header" style={{ marginBottom: 12 }}><span className="section-dot" />Transcript</div>
              {transcript.map((line, i) => {
                const role = normalizeRole(line);
                const isAgent = role === "ai";
                const isSystem = role === "system";
                const roleColor = isSystem ? "#6b7280" : isAgent ? "#22c55e" : "#3b82f6";
                return (
                  <div key={i} className="transcript-row" style={{ display: "flex", gap: 14, padding: "9px 10px", borderRadius: 6, transition: "background 0.1s" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", minWidth: 42, paddingTop: 2, color: roleColor }}>
                      {role.substring(0, 5)}
                    </span>
                    <span style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, flex: 1 }}>{line.text || line.content || line.message || line.msg || ""}</span>
                    {(line.time || line.timestamp) && <span style={{ fontSize: 11, color: "#374151", paddingTop: 2, whiteSpace: "nowrap" }}>{line.time || line.timestamp}</span>}
                  </div>
                );
              })}
            </div>
          )}

          {typeof transcript === "string" && (
            <div className="panel">
              <div className="section-header" style={{ marginBottom: 10 }}><span className="section-dot" />Transcript</div>
              <pre style={{ margin: 0, fontSize: 13, color: "#6b7280", whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "inherit" }}>{transcript}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="panel"><p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>No summary available.</p></div>
      )}
    </div>
  );
}
