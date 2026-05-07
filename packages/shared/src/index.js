export const API_URL = "http://localhost:4000";

/** Absolute URL for listing and mutating rooms. */
export const roomsApiUrl = `${API_URL}/api/rooms`;

/** Relative path segments (for clients that assemble URLs manually). */
export const ROOMS_API_PATH = "/api/rooms";
export const HEALTH_API_PATH = "/health";

/** Full URL for PATCH/DELETE `/api/rooms/:id`. */
export function roomDetailUrl(id) {
  return `${API_URL}${ROOMS_API_PATH}/${encodeURIComponent(String(id))}`;
}

/** Room lifecycle values used by API and UI (lowercase). */
export const ROOM_STATUSES = ["available", "occupied", "maintenance"];

/** Human-readable labels for status chips and selects. */
export const ROOM_STATUS_LABELS = {
  available: "Available",
  occupied: "Occupied",
  maintenance: "Maintenance"
};

export function formatStatusLabel(status) {
  if (!status) return "";
  const key = String(status).toLowerCase();
  return ROOM_STATUS_LABELS[key] ?? status;
}
