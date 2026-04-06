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
