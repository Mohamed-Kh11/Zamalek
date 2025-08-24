import express from "express";
import Match from "../../models/Match.js";
import upload from "../../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { verifyJWT } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Helper function: upload logo to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "zamalek-opponents" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// CREATE match (Admin only)
router.post("/",verifyJWT, upload.single("logo"), async (req, res) => {
  try {
    let logoUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      logoUrl = result.secure_url;
    }

    const {
      date,
      time,
      stadium,
      competition,
      opponentName,
      status,
      homeOrAway,
      zamalekScore,
      opponentScore,
    } = req.body;

    const match = new Match({
      date,
      time,
      stadium,
      competition,
      homeOrAway,
      opponent: { name: opponentName, logoUrl },
      score: {
        zamalek: zamalekScore !== undefined ? Number(zamalekScore) : null,
        opponent: opponentScore !== undefined ? Number(opponentScore) : null,
      },
      status,
    });

    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// READ all matches (Public)
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1, time: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE match (Admin only)
router.patch("/:id",verifyJWT, upload.single("logo"), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle new logo
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updates["opponent.logoUrl"] = result.secure_url;
    }

    // Update opponent name
    if (updates.opponentName) {
      updates["opponent.name"] = updates.opponentName;
      delete updates.opponentName;
    }

    // Update scores
    if (updates.zamalekScore !== undefined) {
      updates["score.zamalek"] = updates.zamalekScore !== "" ? Number(updates.zamalekScore) : null;
      delete updates.zamalekScore;
    }
    if (updates.opponentScore !== undefined) {
      updates["score.opponent"] = updates.opponentScore !== "" ? Number(updates.opponentScore) : null;
      delete updates.opponentScore;
    }

    const updated = await Match.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Match not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE match (Admin only)
router.delete("/:id",verifyJWT, async (req, res) => {
  try {
    const deleted = await Match.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Match not found" });
    res.json({ message: "Match deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
