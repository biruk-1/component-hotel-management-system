const express = require("express");
const {
  getRooms,
  getRoomById,
  getRoomStatsSummary,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", getRooms);
router.get("/stats/summary", getRoomStatsSummary);
router.post("/", createRoom);
router.get("/:id", getRoomById);
router.patch("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
