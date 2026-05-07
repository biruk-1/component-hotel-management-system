import { useState } from "react";
import { formatStatusLabel, ROOM_STATUSES } from "@hotel/shared";

function RoomCard({ room, onUpdateStatus, onDelete }) {
  const [busy, setBusy] = useState(false);
  const statusKey = room.status?.toLowerCase() ?? "";

  const handleStatus = async (event) => {
    const next = event.target.value;
    if (!next || next === statusKey) return;
    setBusy(true);
    try {
      await onUpdateStatus(room.id, next);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Remove “${room.name}” from the list? This cannot be undone in this demo.`
    );
    if (!ok) return;
    setBusy(true);
    try {
      await onDelete(room.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="room-card" aria-labelledby={`room-title-${room.id}`}>
      <div className="room-card-main">
        <h3 id={`room-title-${room.id}`} className="room-card-title">
          {room.name}
        </h3>
        <p className="room-card-meta">Room #{room.id}</p>
      </div>
      <div className="room-card-actions">
        <label className="visually-hidden" htmlFor={`status-${room.id}`}>
          Status for {room.name}
        </label>
        <select
          id={`status-${room.id}`}
          className="room-card-select"
          value={statusKey}
          onChange={handleStatus}
          disabled={busy}
          aria-busy={busy}
        >
          {ROOM_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatusLabel(s)}
            </option>
          ))}
        </select>
        <span className={`status status-${statusKey}`}>{formatStatusLabel(statusKey)}</span>
        <button
          type="button"
          className="btn-ghost btn-danger-ghost"
          onClick={handleDelete}
          disabled={busy}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default RoomCard;
