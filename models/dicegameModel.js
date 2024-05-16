const mongoose = require("mongoose");

const dicegameSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("dicegame", dicegameSchema);
