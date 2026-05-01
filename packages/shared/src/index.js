export const API_URL = "http://localhost:4000";

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
