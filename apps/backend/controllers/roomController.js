const ALLOWED_STATUSES = ["available", "occupied", "maintenance"];

const rooms = [
  { id: 1, name: "Deluxe Suite", status: "available" },
  { id: 2, name: "Standard Room", status: "occupied" }
];

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isValidStatus(status) {
  return ALLOWED_STATUSES.includes(normalizeStatus(status));
}

const getRooms = (_req, res) => {
  try {
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

const createRoom = (req, res) => {
  try {
    const { name, status } = req.body || {};

    if (!name || status === undefined || status === null || status === "") {
      return res
        .status(400)
        .json({ message: "Both 'name' and 'status' are required" });
    }

    const normalized = normalizeStatus(status);
    if (!isValidStatus(normalized)) {
      return res.status(400).json({
        message: `Invalid status. Use one of: ${ALLOWED_STATUSES.join(", ")}`
      });
    }

    const newRoom = {
      id: rooms.length ? rooms[rooms.length - 1].id + 1 : 1,
      name: String(name).trim(),
      status: normalized
    };

    if (!newRoom.name) {
      return res.status(400).json({ message: "Room name must be non-empty" });
    }

    rooms.push(newRoom);
    return res.status(201).json(newRoom);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create room" });
  }
};

const updateRoom = (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid room id" });
    }

    const room = rooms.find((r) => r.id === id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { name, status } = req.body || {};
    const next = { ...room };

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Room name must be non-empty" });
      }
      next.name = trimmed;
    }

    if (status !== undefined && status !== null && status !== "") {
      const normalized = normalizeStatus(status);
      if (!isValidStatus(normalized)) {
        return res.status(400).json({
          message: `Invalid status. Use one of: ${ALLOWED_STATUSES.join(", ")}`
        });
      }
      next.status = normalized;
    }

    const idx = rooms.findIndex((r) => r.id === id);
    rooms[idx] = next;
    return res.status(200).json(next);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update room" });
  }
};

const deleteRoom = (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid room id" });
    }

    const idx = rooms.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: "Room not found" });
    }

    rooms.splice(idx, 1);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete room" });
  }
};

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
};
