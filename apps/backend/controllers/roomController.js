const rooms = [
  { id: 1, name: "Deluxe Suite", status: "available" },
  { id: 2, name: "Standard Room", status: "occupied" }
];

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

    if (!name || !status) {
      return res
        .status(400)
        .json({ message: "Both 'name' and 'status' are required" });
    }

    const newRoom = {
      id: rooms.length ? rooms[rooms.length - 1].id + 1 : 1,
      name: String(name).trim(),
      status: String(status).trim()
    };

    if (!newRoom.name || !newRoom.status) {
      return res
        .status(400)
        .json({ message: "Both 'name' and 'status' must be non-empty" });
    }

    rooms.push(newRoom);
    return res.status(201).json(newRoom);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create room" });
  }
};

module.exports = {
  getRooms,
  createRoom
};
