const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { timeStamp } = require("node:console");

const houseSchema = new mongooseSchema(
  {
    name: {
      type: String,
      required: [true, "house name is required"],
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
  { timeStamp: true },
);

//Ensure owner is always in memebrs
houseSchema.pre("save", function (next) {
  if (!this.members.includes(this.owner)) {
    this.members.push(this.owner);
  }
  next();
});

module.exports = mongoose.model("House", houseSchema);
