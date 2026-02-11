const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  type: String,
  state: String,
  official_link: String,
  youtube_video: String,
  pdf_file: String,
  description: String,
  apply_steps: [String],
  documents_required: [String],
  eligibility: {
    gender: String,
    minAge: Number,
    maxAge: Number,
    caste: [String],
    income: Number,
    education: String,
  },
});

module.exports = mongoose.model("Scheme", schemeSchema);
