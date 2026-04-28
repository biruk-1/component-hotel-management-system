const express = require("express");
const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.patch("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
