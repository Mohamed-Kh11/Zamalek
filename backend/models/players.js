import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true  },
    position: { type: String, required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true },
    image: { type: String }, // URL for player photo
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
