function RoomList({ rooms }) {
  if (!rooms.length) {
    return <p>No rooms found. Create one to get started.</p>;
  }

  return (
    <section>
      <h2>Rooms</h2>
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id} className="room-item">
            <div>
              <strong>{room.name}</strong>
            </div>
            <span className={`status status-${room.status.toLowerCase()}`}>
              {room.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RoomList;
