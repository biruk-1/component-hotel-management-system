import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "@hotel/shared";
import ApiStatus from "../components/ApiStatus";
import CreateRoomForm from "../components/CreateRoomForm";
import LoadingSkeleton from "../components/LoadingSkeleton";
import RoomList from "../components/RoomList";
import StatsBar from "../components/StatsBar";
import Toast from "../components/Toast";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");

      const response = await fetch(`${API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Failed to load rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setFetchError(
        err.message || "Something went wrong while loading rooms."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = async (newRoom) => {
    try {
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
      showToast(`“${createdRoom.name}” was added.`);
    } catch (err) {
      showToast(
        err.message || "Something went wrong while creating the room.",
        "error"
      );
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update room");
      }

      const updated = await response.json();
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast(`Status saved for “${updated.name}”.`);
    } catch (err) {
      showToast(err.message || "Could not update status.", "error");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "DELETE"
      });

      if (response.status === 404) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Room was not found");
      }

      if (!response.ok && response.status !== 204) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to remove room");
      }

      const removed = rooms.find((r) => r.id === id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      if (removed) {
        showToast(`“${removed.name}” removed.`);
      }
    } catch (err) {
      showToast(err.message || "Could not remove room.", "error");
    }
  };

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((room) => {
      const matchesFilter =
        filter === "all" || room.status?.toLowerCase() === filter;
      const matchesSearch =
        !q ||
        room.name?.toLowerCase().includes(q) ||
        String(room.id).includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [rooms, filter, search]);

  const loadFailedEmpty = Boolean(fetchError && rooms.length === 0 && !loading);

  return (
    <main id="main-content" className="main-panel">
      <div className="main-panel-inner">
        <div className="page-intro">
          <div>
            <h1 className="page-title">Room operations</h1>
            <p className="page-subtitle">
              Search, filter, and update room status in real time against the Express
              demo API.
            </p>
          </div>
          <div className="page-intro-actions">
            <ApiStatus />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => fetchRooms()}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh list"}
            </button>
          </div>
        </div>

        {toast ? (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => setToast(null)}
          />
        ) : null}

        <CreateRoomForm onCreate={handleCreateRoom} />

        <section className="toolbar" aria-label="Search and filters">
          <div className="search-field">
            <label htmlFor="room-search">Search</label>
            <input
              id="room-search"
              type="search"
              placeholder="Name or room number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              disabled={loadFailedEmpty}
            />
          </div>
          <StatsBar rooms={rooms} filter={filter} onFilterChange={setFilter} />
        </section>

        {fetchError ? (
          <div className="banner banner-error" role="alert">
            <p>{fetchError}</p>
            <button type="button" className="btn-inline" onClick={fetchRooms}>
              Try again
            </button>
          </div>
        ) : null}

        {loading ? (
          <LoadingSkeleton />
        ) : loadFailedEmpty ? (
          <div className="empty-state empty-state-critical" role="alert">
            <p className="empty-state-title">Could not reach the API</p>
            <p className="empty-state-hint">
              Start the backend on port 4000, then use Refresh or Try again.
            </p>
          </div>
        ) : (
          <RoomList
            rooms={filteredRooms}
            totalCount={rooms.length}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteRoom}
          />
        )}
      </div>
    </main>
  );
}

export default RoomsPage;
