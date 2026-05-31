import React, { useState, useEffect } from "react";

export default function ElapsedTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);
  const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return <span style={{ fontFamily: "'Courier New', monospace", fontSize: 28, fontWeight: 300, color: "#fff", letterSpacing: 2 }}>{m}:{s}</span>;
}
