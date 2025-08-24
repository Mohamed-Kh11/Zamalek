import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  date: { type: String, required: true },   // e.g. "2025-09-10"
  time: { type: String, required: true },   // e.g. "19:00"
  stadium: { type: String, required: true },
  competition: { type: String, required: true },
  homeOrAway: {
    type: String,
    enum: ["home", "away"],
    required: true
  },
  opponent: {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true }
  },
  score: {
    zamalek: { type: Number, default: null },
    opponent: { type: Number, default: null }
  },
  status: {
    type: String,
    enum: ["upcoming", "finished", "live"],
    default: "upcoming"
  }
});

export default mongoose.model("Match", matchSchema);
