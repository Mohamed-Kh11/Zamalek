import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    team: { type: String, required: true },
    points: { type: Number, required: true },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
