import { useEffect, useState } from "react";
import { API_URL } from "@hotel/shared";
import RoomList from "../components/RoomList";
import CreateRoomForm from "../components/CreateRoomForm";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Failed to load rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message || "Something went wrong while loading rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (newRoom) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRoom)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to create room");
      }

      const createdRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, createdRoom]);
    } catch (err) {
      setError(err.message || "Something went wrong while creating room");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <main className="container">
      <h1>Hotel Management</h1>
      <p>Manage room availability in one place.</p>

      <CreateRoomForm onCreate={handleCreateRoom} />

      {loading && <p>Loading rooms...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <RoomList rooms={rooms} />}
    </main>
  );
}

export default RoomsPage;
