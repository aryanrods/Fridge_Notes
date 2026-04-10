const GroceryItem = require("../models/GroceryItem");
const { getIO } = require("../sockets/socketManager");

// @desc   Get all grocery items for a house
// @route  GET /api/items/:houseId
// @access Private (members only)

// ✅ Get items
const getItems = async (req, res, next) => {
  try {
    const { purchased } = req.query;

    const query = { houseId: req.house._id };

    if (purchased !== undefined) {
      query.purchased = purchased === "true";
    }

    const items = await GroceryItem.find(query)
      .populate("addedBy", "name email")
      .populate("purchasedBy", "name email")
      .sort({ purchased: 1, createdAt: -1 });

    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};
// @desc   Add a grocery item
// @route  POST /api/items
// @access Private (house member)

// ✅ Add item
const addItem = async (req, res, next) => {
  try {
    const { name, quantity, category, notes, priority } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Item name required",
      });
    }

    const item = await GroceryItem.create({
      houseId: req.house._id,
      name: name.trim(),
      quantity: quantity?.trim() || "1",
      category: category || "other",
      notes: notes?.trim() || "",
      priority: priority || "medium",
      addedBy: req.user._id,
    });

    const populatedItem = await GroceryItem.findById(item._id)
      .populate("addedBy", "name email")
      .populate("purchasedBy", "name email");

    getIO().to(`house:${req.house._id}`).emit("item:added", {
      item: populatedItem,
    });

    res.status(201).json({ success: true, item: populatedItem });
  } catch (err) {
    next(err);
  }
};

// @desc   Update a grocery item
// @route  PUT /api/items/:id
// @access Private (house member)
// ✅ Update item
const updateItem = async (req, res, next) => {
  try {
    const item = req.item;

    const allowedFields = ["name", "quantity", "category", "notes", "priority"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    const updatedItem = await GroceryItem.findById(item._id)
      .populate("addedBy", "name email")
      .populate("purchasedBy", "name email");

    getIO().to(`house:${item.houseId}`).emit("item:updated", {
      item: updatedItem,
    });

    res.json({ success: true, item: updatedItem });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle purchased status
// @route  PATCH /api/items/:id/purchased
// @access Private (house member)

// ✅ Toggle purchased
const togglePurchased = async (req, res, next) => {
  try {
    const item = req.item;

    item.purchased = !item.purchased;
    item.purchasedBy = item.purchased ? req.user._id : null;
    item.purchasedAt = item.purchased ? new Date() : null;

    await item.save();

    const updatedItem = await GroceryItem.findById(item._id)
      .populate("addedBy", "name email")
      .populate("purchasedBy", "name email");

    getIO().to(`house:${item.houseId}`).emit("item:purchased", {
      item: updatedItem,
    });

    res.json({ success: true, item: updatedItem });
  } catch (err) {
    next(err);
  }
};

//@desc Delete item
//@route /api/items/:id
// @access Private(house member)

// ✅ Delete item
const deleteItem = async (req, res, next) => {
  try {
    const item = req.item;

    const canDelete =
      item.addedBy.toString() === req.user._id.toString() ||
      req.house.owner.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete",
      });
    }

    await item.deleteOne();

    getIO().to(`house:${item.houseId}`).emit("item:deleted", {
      itemId: item._id,
    });

    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};

//@desc Clear the purchased items
//@route /api/items/:houseId/clear-purchased
// @access Private(house member)
// ✅ Clear purchased
const clearPurchased = async (req, res, next) => {
  try {
    await GroceryItem.deleteMany({
      houseId: req.house._id,
      purchased: true,
    });

    getIO().to(`house:${req.house._id}`).emit("items:cleared", {
      houseId: req.house._id,
    });

    res.json({ success: true, message: "Cleared purchased items" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  addItem,
  updateItem,
  togglePurchased,
  deleteItem,
  clearPurchased,
};
