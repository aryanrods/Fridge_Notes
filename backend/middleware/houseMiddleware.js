const House = require("../models/House");

// Verify user is a member of the house
const isMember = async (req, res, next) => {
  try {
    const houseId = req.params.houseId || req.params.id || req.body.houseId;
    const house = await House.findById(houseId);

    if (!house) {
      return res
        .status(404)
        .json({ success: false, message: "House not found" });
    }

    const isMemberOfHouse = house.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );

    if (!isMemberOfHouse) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not member of this house.",
      });
    }
    req.house = house;
    next();
  } catch (error) {
    next(error);
  }
};

//Verify user is the owner of the hosue

const isOwner = async (req, res, next) => {
  try {
    const house = req.house;
    if (house.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the house owner can perform this action",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

//Get item middleware

const getItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "item not found",
      });
    }
  } catch (error) {}
};

module.exports = { isMember, isOwner };
