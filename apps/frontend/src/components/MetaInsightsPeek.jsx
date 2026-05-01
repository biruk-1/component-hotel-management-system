import { useCallback, useEffect, useId, useState } from "react";
import { API_URL } from "@hotel/shared";

async function fetchJson(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("meta_request_failed");
  return res.json();
}

function MetaInsightsPeek() {
  const hid = useId();
  const [telemetryCount, setTelemetryCount] = useState(null);
  const [forecastNights, setForecastNights] = useState(7);
  const [forecastPeek, setForecastPeek] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadTelemetry = useCallback(async () => {
    try {
      setBusy(true);
      setErr("");
      const body = await fetchJson("/api/meta/catalog/telemetry-keys");
      setTelemetryCount(body?.count ?? null);
    } catch {
      setErr("Meta API unreachable (ensure backend runs on port 4000).");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadForecastPeek = useCallback(async () => {
    try {
      setBusy(true);
      setErr("");
      const body = await fetchJson(
        `/api/meta/insights/revenue/week?nights=${encodeURIComponent(forecastNights)}`
      );
      const nightly = body?.data?.nightly ?? [];
      setForecastPeek({
        adrGuess: body?.data?.nightlyAdrGuess,
        snippet: nightly.slice(0, 3)
      });
    } catch {
      setErr("Meta forecast unavailable.");
    } finally {
      setBusy(false);
    }
  }, [forecastNights]);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  useEffect(() => {
    loadForecastPeek();
  }, [loadForecastPeek]);

  return (
    <section className="meta-insights" aria-labelledby={`${hid}-h`}>
      <div className="meta-insights-header">
        <h2 id={`${hid}-h`} className="meta-insights-title">
          Insight peek
        </h2>
        <span className="meta-insights-badge" aria-live="polite">
          {busy ? "Loading…" : "Live probes"}
        </span>
      </div>
      {err ? <p className="banner banner-error">{err}</p> : null}
      <div className="meta-grid">
        <article className="meta-card">
          <h3 className="meta-card-title">Telemetry catalog</h3>
          <p className="meta-card-lead">
            Synthetic metric keys surfaced from the `/api/meta` bundle (Abdurahman&apos;s
            backend drills).
          </p>
          <p className="meta-stat">{telemetryCount ?? "—"}</p>
          <button type="button" className="btn-secondary btn-compact" onClick={loadTelemetry}>
            Refresh
          </button>
        </article>
        <article className="meta-card">
          <h3 className="meta-card-title">Forecast window</h3>
          <label className="meta-label" htmlFor={`${hid}-n`}>
            Nights
          </label>
          <select
            id={`${hid}-n`}
            className="meta-select"
            value={forecastNights}
            onChange={(e) => setForecastNights(Number(e.target.value))}
          >
            {[3, 7, 14, 21, 28].map((n) => (
              <option key={n} value={n}>
                {n} nights
              </option>
            ))}
          </select>
          <p className="meta-card-lead">ADR guesses are synthetic pacing helpers only.</p>
          <p className="meta-stat">{forecastPeek?.adrGuess ?? "—"} ADR pivot</p>
          <ul className="meta-list">
            {(forecastPeek?.snippet ?? []).map((row) => (
              <li key={row.day}>
                Day {row.day}: {row.adrLift}
              </li>
            ))}
          </ul>
          <button type="button" className="btn-secondary btn-compact" onClick={loadForecastPeek}>
            Recalculate
          </button>
        </article>
      </div>
    </section>
  );
}

export default MetaInsightsPeek;
