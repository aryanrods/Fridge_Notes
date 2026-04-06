const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const houseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "House name is required"],
      trim: true,
      minlength: [2, "House name must be at least 2 characters"],
      maxlength: [60, "House name cannot exceed 60 characters"],
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => nanoid(8).toUpperCase(),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: "",
    },
    emoji: {
      type: String,
      default: "🏠",
    },
  },
  { timestamps: true },
);

// Ensure owner is always in members
houseSchema.pre("save", function () {
  if (!this.members.includes(this.owner)) {
    this.members.push(this.owner);
  }
});

module.exports = mongoose.model("House", houseSchema);
