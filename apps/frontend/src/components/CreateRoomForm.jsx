import { useState } from "react";

function CreateRoomForm({ onCreate }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("available");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    await onCreate({
      name: name.trim(),
      status
    });
    setName("");
    setStatus("available");
    setSubmitting(false);
  };

  return (
    <section className="form-section">
      <h2>Create Room</h2>
      <form onSubmit={handleSubmit} className="room-form">
        <label htmlFor="name">Room Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Executive Suite"
          required
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="available">available</option>
          <option value="occupied">occupied</option>
          <option value="maintenance">maintenance</option>
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Room"}
        </button>
      </form>
    </section>
  );
}

export default CreateRoomForm;
