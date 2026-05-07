import { useState } from "react";
import { formatStatusLabel, ROOM_STATUSES } from "@hotel/shared";

function CreateRoomForm({ onCreate }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("available");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        status
      });
      setName("");
      setStatus("available");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-section" aria-labelledby="create-room-heading">
      <h2 id="create-room-heading" className="section-heading">
        Add a room
      </h2>
      <p className="form-lead">
        New rooms appear in the directory immediately and sync with the demo API.
      </p>
      <form onSubmit={handleSubmit} className="room-form">
        <div className="field-group">
          <label htmlFor="name">Room name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Executive Suite"
            autoComplete="off"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="status">Initial status</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {ROOM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Adding…" : "Add room"}
        </button>
      </form>
    </section>
  );
}

export default CreateRoomForm;
