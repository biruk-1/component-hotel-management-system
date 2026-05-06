import RoomCard from "./RoomCard";

function RoomList({ rooms, totalCount, onUpdateStatus, onDelete }) {
  if (!rooms.length) {
    const isGlobalEmpty = totalCount === 0;
    return (
      <div className="empty-state" role="status">
        <p className="empty-state-title">
          {isGlobalEmpty ? "No rooms yet" : "No rooms match"}
        </p>
        <p className="empty-state-hint">
          {isGlobalEmpty
            ? "Create your first room with the form above to see it listed here."
            : "Try another filter or search, or add a new room above."}
        </p>
      </div>
    );
  }

  return (
    <section className="room-grid-section" aria-labelledby="rooms-heading">
      <h2 id="rooms-heading" className="section-heading">
        Room directory
      </h2>
      <ul className="room-grid">
        {rooms.map((room) => (
          <li key={room.id}>
            <RoomCard room={room} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RoomList;
