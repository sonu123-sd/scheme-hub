const mongoose = require("mongoose");

const schemeApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    schemeId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    applied: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["applied", "not_applied", "pending"],
      required: true,
      default: "not_applied",
    },
    appliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

schemeApplicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

module.exports = mongoose.model("SchemeApplication", schemeApplicationSchema);
