const House = require("../models/House");
const User = require("../models/User");
const GroceryItem = require("../models/GroceryItem.js");
const { nanoid } = require("nanoid");

// @desc Create a new house
// @route POST/api/houses/create
// @access Private

const createHouse = async (req, res, next) => {
  try {
    const { name, description, emoji } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "House name is required" });
    }

    //Create house
    const house = await House.create({
      name: name.trim(),
      description: description?.trim() || "",
      emoji: emoji || "🏠",
      owner: req.user._id,
      members: [req.user._id],
    });

    //Add house to user's house array
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        houses: house._id,
      },
    });

    const populatedHouse = await House.findById(house._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json({
      success: true,
      message: "house create successfully",
      house: populatedHouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Join a house with invite code
// @route POST /api/houses/join
// @access Private

const joinHouse = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    console.log(req.body);

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: "Invite code is requied",
      });
    }
    const house = await House.findOne({
      inviteCode: inviteCode.toUpperCase().trim(),
    });
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "No house found with that invite code",
      });
    }
    const alreadyMember = house.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are arleady a member of this house ",
      });
    }
    house.members.push(req.user._id);
    await house.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        houses: house._id,
      },
    });
    const populatedHouse = await House.findById(house._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({
      success: true,
      message: `you have joined "${house.name}"`,
      house: populatedHouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all houses for current user
// @route Get/ api/houses
// @access Private

const getHouses = async (req, res, next) => {
  try {
    const houses = await House.find({ members: req.user._id })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    //Get Item counts per house
    const housesWithCounts = await Promise.all(
      houses.map(async (house) => {
        const itemCount = await GroceryItem.countDocuments({
          houseId: house._id,
          purchased: false,
        });
        const totalCount = await GroceryItem.countDocuments({
          houseId: house._id,
        });
        return {
          ...house.toObject(),
          pendingItems: itemCount,
          totalItems: totalCount,
        };
      }),
    );
    res.json({ success: true, houses: housesWithCounts });
  } catch (error) {
    next(error);
  }
};
// @desc   Get single house details
// @route  GET /api/houses/:id
// @access Private (members only)

const getHouseById = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!house) {
      return res
        .status(404)
        .json({ success: false, message: "House not found " });
    }

    res.json({ success: true, house });
  } catch (error) {
    next(error);
  }
};

//@desc Regenerate invite code
//@route PATCH /api/houses/:id/regenerate-code
//@access Private (members only)

const regenerateInviteCode = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res
        .status(404)
        .json({ success: false, message: "house not found" });
    }
    if (house.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can regenerate the invite code",
      });
    }
    house.inviteCode = nanoid(8).toUpperCase();
    await house.save();

    res.json({
      success: true,
      message: "Invite code regenerated",
      inviteCode: house.inviteCode,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Leave a house
//@route DELETE /api/houses/:id/leave
//@access Private

const leaveHouse = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res
        .status(404)
        .json({ success: false, message: "House not found" });
    }

    if (house.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot leave. Transfer ownership or delete the house.",
      });
    }
    house.members = house.members.filter(
      (m) => m.toString() !== req.user._id.toString(),
    );
    await house.save();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { houses: house._id },
    });

    res.json({ success: true, message: "You have left the house." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHouse,
  joinHouse,
  getHouses,
  getHouseById,
  regenerateInviteCode,
  leaveHouse,
};
