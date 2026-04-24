const House = require("../models/House");
const GroceryItem = require("../models/GroceryItem");

// Verify user is a member of the house
const isMember = async (req, res, next) => {
  try {
    const houseId = (req.item?.houseId || req.params.houseId)?.toString();

    if (!houseId) {
      return res.status(400).json({
        success: false,
        message: "House ID not found",
      });
    }

    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    const isMemberOfHouse = house.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );

    if (!isMemberOfHouse) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this house.",
      });
    }

    req.house = house;
    next();
  } catch (error) {
    next(error);
  }
};

// Verify user is the owner of the house
const isOwner = async (req, res, next) => {
  try {
    const house = req.house;

    if (house.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the house owner can perform this action.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Get item and attach to req
const getItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    req.item = item;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isMember, isOwner, getItem };
