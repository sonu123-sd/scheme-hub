const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, default: "" },
    surname: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    maritalStatus: { type: String, default: "" },
    caste: { type: String, default: "" },
    education: { type: String, default: "" },
    employment: { type: String, default: "" },
    mobile: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    state: { type: String, required: true },
    password: { type: String, required: true },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // ✅ REQUIRED FOR SAVE / UNSAVE
    savedSchemes: {
      type: [String],
      default: [],
    },

    // ✅ REQUIRED FOR RECENT TAB
    recentlyViewed: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
