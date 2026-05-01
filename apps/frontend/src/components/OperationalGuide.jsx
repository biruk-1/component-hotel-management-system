import { useCallback, useId, useMemo, useState } from "react";
import { STAYGRID_PLAYBOOK_STEPS } from "../help/staygridPlaybook";

const PAGE_WINDOW = 8;

function OperationalGuide() {
  const headingId = useId();
  const [open, setOpen] = useState(false);
  const [sliceStart, setSliceStart] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STAYGRID_PLAYBOOK_STEPS;
    return STAYGRID_PLAYBOOK_STEPS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
    );
  }, [query]);

  const windowed = useMemo(() => {
    return filtered.slice(sliceStart, sliceStart + PAGE_WINDOW);
  }, [filtered, sliceStart]);

  const canPrev = sliceStart > 0;
  const canNext = sliceStart + PAGE_WINDOW < filtered.length;

  const bump = useCallback(
    (dir) => {
      setSliceStart((v) => {
        const maxStart = Math.max(0, filtered.length - PAGE_WINDOW);
        const next = v + dir * PAGE_WINDOW;
        return Math.max(0, Math.min(maxStart, next));
      });
    },
    [filtered.length]
  );

  return (
    <section className="operational-guide" aria-labelledby={headingId}>
      <div className="operational-guide-toolbar">
        <h2 id={headingId} className="operational-guide-title">
          On-property playbook ({STAYGRID_PLAYBOOK_STEPS.length} cues)
        </h2>
        <button
          type="button"
          className="btn-secondary btn-compact"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      {!open ? (
        <p className="operational-guide-muted">
          Training checklist used for kiosk, housekeeping coordination, and nightly
          audit drills. Expand to browse search and pagination.
        </p>
      ) : (
        <>
          <div className="operational-guide-controls">
            <label className="visually-hidden" htmlFor={`${headingId}-q`}>
              Filter playbook cues
            </label>
            <input
              id={`${headingId}-q`}
              type="search"
              className="operational-guide-input"
              placeholder="Filter by keyword…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSliceStart(0);
              }}
            />
            <div className="operational-guide-pager">
              <button
                type="button"
                className="btn-ghost btn-compact"
                disabled={!canPrev}
                onClick={() => bump(-1)}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn-ghost btn-compact"
                disabled={!canNext}
                onClick={() => bump(1)}
              >
                Next
              </button>
            </div>
          </div>
          <ul className="operational-guide-list">
            {windowed.map((step) => (
              <li key={step.key} className="operational-guide-item">
                <p className="operational-guide-item-title">{step.title}</p>
                <p className="operational-guide-item-body">{step.body}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default OperationalGuide;
