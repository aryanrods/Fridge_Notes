const mongoose = require("mongoose");

const groceryItemSchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: [true, "House Id is required"],
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Item name cannot be empty"],
      maxlength: [100, "Item name cannot exceed 100 chara"],
    },
    quantity: {
      type: String,
      trim: true,
      default: "1",
      maxlength: [50, "Quantity cannot exceed 50 characters"],
    },
    category: {
      type: String,
      enum: [
        "produce",
        "dairy",
        "meat",
        "bakery",
        "frozen",
        "beverages",
        "snacks",
        "household",
        "other",
      ],
      default: "other",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Notes cannot exceed 200 char"],
      default: "",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: null,
    },
    purchasedAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

//When marking as purchased clarify who and whom

groceryItemSchema.pre("save", function (next) {
  if (this.isModified("purchased") && this.purchased && !this.purchasedAt) {
    this.purchasedAt = new Date();
  }
  if (this.isModified("purchased") && !this.purchased) {
    this.purchasedAt = null;
    this.purchasedBy = null;
  }
});

module.exports = mongoose.model("GroceryItem", groceryItemSchema);
