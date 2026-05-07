import { formatStatusLabel, ROOM_STATUSES } from "@hotel/shared";

function StatsBar({ rooms, filter, onFilterChange }) {
  const counts = ROOM_STATUSES.reduce(
    (acc, s) => {
      acc[s] = rooms.filter((r) => r.status?.toLowerCase() === s).length;
      return acc;
    },
    { available: 0, occupied: 0, maintenance: 0 }
  );

  const total = rooms.length;
  const items = [
    { id: "all", label: "All rooms", count: total },
    ...ROOM_STATUSES.map((s) => ({
      id: s,
      label: formatStatusLabel(s),
      count: counts[s]
    }))
  ];

  return (
    <div className="stats-bar" role="group" aria-label="Filter rooms by status">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`stat-chip ${filter === item.id ? "stat-chip-active" : ""}`}
          onClick={() => onFilterChange(item.id)}
        >
          <span className="stat-chip-label">{item.label}</span>
          <span className="stat-chip-count">{item.count}</span>
        </button>
      ))}
    </div>
  );
}

export default StatsBar;
