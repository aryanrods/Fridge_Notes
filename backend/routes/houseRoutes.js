const router = require("express").Router();

const {
  createHouse,
  joinHouse,
  getHouses,
  getHouseById,
  regenerateInviteCode,
  leaveHouse,
} = require("../controllers/houseController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/create", createHouse);
router.post("/join", joinHouse);
router.get("/", getHouses);
router.get("/:id", getHouseById);
router.patch("/:id/regenerate-code", regenerateInviteCode);
router.delete("/:id/leave", leaveHouse);

module.exports = router;
