const router = require("express").Router();

const {
  getItems,
  addItem,
  updateItem,
  togglePurchased,
  deleteItem,
  clearPurchased,
} = require("../controllers/itemController");

const { getItem, isMember } = require("../middleware/houseMiddleware");

const { protect } = require("../middleware/authMiddleware");
router.use(protect);

router.get("/:houseId", isMember, getItems);
router.delete("/:houseId/clear-purchased", isMember, clearPurchased);
router.post("/:houseId", isMember, addItem);
router.put("/:id", getItem, isMember, updateItem);
router.patch("/:id/purchased", getItem, isMember, togglePurchased);
router.delete("/:id", getItem, isMember, deleteItem);

module.exports = router;
