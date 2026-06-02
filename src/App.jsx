import { useState, useEffect, useRef } from "react";
import { STAGES, TERMINAL_STATUSES, STATUS_COLORS } from "./constants";
import Navbar from "./components/Navbar";
import FormStage from "./components/FormStage";
import CallingStage from "./components/CallingStage";
import SummaryStage from "./components/SummaryStage";

export default function App() {
  const BASE_URL = "https://talko.siddharth28.dpdns.org";
  const [stage, setStage] = useState(STAGES.FORM);
  const [form, setForm] = useState({ to_number: "+91 9810706119", target_name: "", agent_persona: "", objective: "", constraints: "", opening_msg: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callStatus, setCallStatus] = useState("initiated");
  const [callStartTime, setCallStartTime] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [verifyCode, setVerifyCode] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const pollRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.to_number.trim()) e.to_number = true;
    if (!form.target_name.trim()) e.target_name = true;
    if (!form.agent_persona.trim()) e.agent_persona = true;
    if (!form.objective.trim()) e.objective = true;
    return e;
  };

  const handleChange = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: false }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        agent_persona: form.agent_persona,
        objective: form.objective,
        to_number: form.to_number,
        target_name: form.target_name,
        constraints: form.constraints,
        ...(form.opening_msg.trim() ? { opening_msg: form.opening_msg } : {}),
      };
      const res = await fetch(`${BASE_URL}/api/place-call`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCallId(data.call_id || data.id || data.callsid);
      setCallStatus("initiated");
      setCallStartTime(Date.now());
      setStatusHistory([{ status: "initiated", time: new Date().toLocaleTimeString() }]);
      setStage(STAGES.CALLING);
    } catch (e) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!form.to_number.trim()) {
      setErrors(e => ({ ...e, to_number: true }));
      return;
    }
    setVerifyLoading(true);
    setVerifyStatus(null);
    setVerifyCode(null);
    try {
      const res = await fetch(`${BASE_URL}/api/verify_num`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.to_number),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.status === "already verified") {
        const cleaned = data.phone_number || form.to_number;
        setForm(f => ({ ...f, to_number: cleaned }));
        setIsVerified(true);
        setVerifyStatus("verified");
        return;
      }
      if (data.status === "invalid phone number") {
        setVerifyStatus("invalid");
        return;
      }
      if (data.status === "verifying") {
        const cleaned = data.phone_number || form.to_number;
        setForm(f => ({ ...f, to_number: cleaned }));
        setVerifyStatus("verifying");
        setVerifyCode(data.code || null);
        return;
      }
      setVerifyStatus("unknown");
    } catch (e) {
      setVerifyStatus("error");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setIsVerified(false);
    setVerifyStatus(null);
    setVerifyCode(null);
    setForm(f => ({ ...f, to_number: "" }));
  };

  useEffect(() => {
    if (stage !== STAGES.CALLING || !callId) return;
    const poll = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(callId),
        });
        if (!res.ok) return;
        const data = await res.json();
        const newStatus = data.status;
        setCallStatus(prev => {
          if (prev !== newStatus) setStatusHistory(h => [...h, { status: newStatus, time: new Date().toLocaleTimeString() }]);
          return newStatus;
        });
        if (TERMINAL_STATUSES.includes(newStatus)) {
          clearInterval(pollRef.current);
          if (newStatus === "completed") fetchSummary();
          else setStage(STAGES.SUMMARY);
        }
      } catch {}
    };
    pollRef.current = setInterval(poll, 3000);
    poll();
    return () => clearInterval(pollRef.current);
  }, [stage, callId]);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setStage(STAGES.SUMMARY);
    try {
      const res = await fetch(`${BASE_URL}/api/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callId),
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      let chatHistory = data?.chat_history ?? data?.transcript ?? data?.messages ?? data;
      if (typeof chatHistory === "string") {
        try {
          chatHistory = JSON.parse(chatHistory);
        } catch {
          chatHistory = chatHistory;
        }
      }
      setSummary({ ...data, chat_history: chatHistory });
    } catch (e) { setSummary({ error: e.message }); }
    finally { setSummaryLoading(false); }
  };

  const reset = () => {
    clearInterval(pollRef.current);
    setStage(STAGES.FORM); setCallId(null); setCallStatus("initiated");
    setCallStartTime(null); setSummary(null); setStatusHistory([]); setErrors({});
  };

  const statusColor = STATUS_COLORS[callStatus] || "#22c55e";
  const statusLabel = callStatus?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) || "Initiated";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif", color: "#e5e7eb", overflow: "hidden" }}>
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2.2);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        .ad-input {
          width: 100%; background: #161616; border: 1px solid #2a2a2a;
          border-radius: 6px; color: #e5e7eb; font-size: 13px; font-family: inherit;
          padding: 10px 13px; outline: none; transition: border-color 0.15s; resize: none;
        }
        .ad-input:focus { border-color: #3a3a3a; }
        .ad-input.err { border-color: #7f1d1d; background: #1a0f0f; }
        .ad-input::placeholder { color: #3a3a3a; }
        .panel { background: #111111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 22px 20px; display: flex; flex-direction: column; gap: 16px; }
        .field-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; color: #4b5563; text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .section-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; display: inline-block; flex-shrink: 0; }
        .section-header { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: #6b7280; text-transform: uppercase; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .launch-btn {
          width: 100%; background: #111; border: 1px solid #2a2a2a; border-radius: 8px;
          color: #e5e7eb; font-size: 14px; font-weight: 500; letter-spacing: 0.04em;
          padding: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 10px; transition: background 0.15s, border-color 0.15s; font-family: inherit;
        }
        .launch-btn:hover { background: #1a1a1a; border-color: #3a3a3a; }
        .launch-btn:active { background: #222; }
        .launch-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .transcript-row:hover { background: #161616; }
        .new-call-btn {
          background: transparent; border: 1px solid #2a2a2a; border-radius: 6px;
          color: #6b7280; font-size: 12px; padding: 7px 14px; cursor: pointer;
          font-family: inherit; letter-spacing: 0.05em; transition: all 0.15s;
        }
        .new-call-btn:hover { border-color: #3a3a3a; color: #9ca3af; }
      `}</style>

      {/* ── NAVBAR ── */}
      <Navbar stage={stage} statusColor={statusColor} statusLabel={statusLabel} />

      {/* ── FORM STAGE ── */}
      {stage === STAGES.FORM && (
        isVerified ? (
          <FormStage
            form={form}
            errors={errors}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            hidePhone
            verifiedNumber={form.to_number}
            onChangeNumber={handleChangeNumber}
          />
        ) : (
          <div style={{ flex: 1, padding: "44px 28px 40px", maxWidth: 720, width: "100%", margin: "0 auto", animation: "fadeUp 0.3s ease both" }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#374151", textTransform: "uppercase" }}>Verification</p>
              <h1 style={{ margin: "0 0 10px", fontSize: 40, fontWeight: 300, color: "#f9fafb", lineHeight: 1.1, letterSpacing: "-1px", fontFamily: "'Georgia', serif" }}>Verify Your Number</h1>
              <p style={{ margin: 0, fontSize: 14, color: "#4b5563" }}>We need to verify your phone number before placing calls.</p>
            </div>

            <div className="panel" style={{ gap: 14, borderColor: "#3b2f1a", background: "#12100a" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: "#1a140a", border: "1px solid #3b2f1a" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", marginTop: 6, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 13, color: "#fef3c7", lineHeight: 1.5 }}>
                  For now, new number verification is halted due to Twilio free account restrictions. Please try with my number, i.e +91 9810706119. Or <a href="mailto:siddharth_c1@me.iitr.ac.in">contact me</a> to get your number verified to use it.
                </p>
              </div>
              <div>
                <div className="field-label">Phone Number</div>
                <input
                  className={`ad-input${errors.to_number ? " err" : ""}`}
                  type="tel"
                  placeholder="+91 9341419041"
                  value={form.to_number}
                  onChange={e => handleChange("to_number", e.target.value)}
                />
              </div>

              <button className="launch-btn" onClick={handleVerify} disabled={verifyLoading}>
                {verifyLoading ? (
                  <><span style={{ width: 14, height: 14, border: "1.5px solid #444", borderTop: "1.5px solid #9ca3af", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Verifying…</>
                ) : (
                  <>Verify Number</>
                )}
              </button>

              {verifyStatus === "invalid" && (
                <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>Invalid phone number. Please check and try again.</p>
              )}
              {verifyStatus === "verifying" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {verifyCode && (
                    <p style={{ margin: 0, fontSize: 13, color: "#e5e7eb" }}>Verification code: <span style={{ color: "#22c55e" }}>{verifyCode}</span></p>
                  )}
                  <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>A verification call will be made soon. Refresh after it completes to re-check.</p>
                </div>
              )}
              {verifyStatus === "error" && (
                <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>Verification failed. Please try again.</p>
              )}
            </div>
          </div>
        )
      )}

      {/* ── CALLING STAGE ── */}
      {stage === STAGES.CALLING && (
        <CallingStage
          form={form}
          callStartTime={callStartTime}
          statusColor={statusColor}
          statusLabel={statusLabel}
          statusHistory={statusHistory}
        />
      )}

      {/* ── SUMMARY STAGE ── */}
      {stage === STAGES.SUMMARY && (
        <SummaryStage
          form={form}
          summaryLoading={summaryLoading}
          summary={summary}
          reset={reset}
        />
      )}
    </div>
  );
}
