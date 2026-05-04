import { useEffect, useState } from "react";
import { API_URL } from "@hotel/shared";

function ApiStatus() {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { method: "GET" });
        if (!cancelled) {
          setState({ loading: false, ok: res.ok });
        }
      } catch {
        if (!cancelled) {
          setState({ loading: false, ok: false });
        }
      }
    };

    ping();
    const id = setInterval(ping, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const label = state.loading
    ? "Checking API…"
    : state.ok
      ? "API online"
      : "API unreachable";

  return (
    <div
      className={`api-status api-status-${state.loading ? "pending" : state.ok ? "ok" : "down"}`}
      role="status"
      aria-live="polite"
      title={label}
    >
      <span className="api-status-dot" aria-hidden="true" />
      <span className="api-status-text">{label}</span>
    </div>
  );
}

export default ApiStatus;
