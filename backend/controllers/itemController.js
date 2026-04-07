const GroceryItem = require("../models/GroceryItem");
const House = require("../models/House");
const { getIO } = require("../sockets/SocketManager");

//@desc Get all grocery items for a house
//@route GET GET / api/items/:houseId
//@access Private (members only)

const getItems = async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const { purchased } = req.query;

    const query = { houseId };
    if (purchased !== undefined) {
      query.purchased = purchased = "true";
    }

    const items = await GroceryItem.find(query)
      .populate("addedBy", "name email")
      .populate("purchasedBy", "name email")
      .sort({ purchased: 1, createdAt: -1 });

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Add a grocery item
// @route  POST /api/items
// @access Private (house member)
const addItem = async (req, res, next) => {
  try {
    const { houseId, name, quantity, category, notes, priority } = req.body;
    if (!houseId || !name) {
      return res.status(400).json({
        success: false,
        message: "House ID and item name are required",
      });

      //Verify user is a member
      const house = await House.findById(houseId);
      if (!house) {
        return res
          .status(404)
          .json({ success: false, message: "House not found." });
      }
      const isMember = house.members.some((m) => m.toString() === req.user._id);
    }
  } catch (error) {}
};
