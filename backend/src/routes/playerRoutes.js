import express from "express";
import Player from "../../models/players.js";
import upload from "../../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { verifyJWT } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Helper: upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "zamalek-players" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

// GET all players
router.get("/", async (req, res) => {
  try {
    const players = await Player.find().sort({ team: 1, name: 1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Error fetching players" });
  }
});

// POST add new player (admin)
router.post("/", verifyJWT, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const player = new Player({ ...req.body, image: imageUrl });
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ message: "Error adding player", error: err.message });
  }
});

// PUT update player (admin)
router.put("/:id", verifyJWT, upload.single("image"), async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updatedData.image = result.secure_url;
    }

    const player = await Player.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(player);
  } catch (err) {
    res.status(400).json({ message: "Error updating player", error: err.message });
  }
});

// DELETE player (admin)
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting player", error: err.message });
  }
});

export default router;
