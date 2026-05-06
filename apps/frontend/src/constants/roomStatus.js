/** Mirrors shared room metadata until the shared package branch is merged into main. */
export const ROOM_STATUSES = ["available", "occupied", "maintenance"];

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
