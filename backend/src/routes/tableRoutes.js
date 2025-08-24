import express from "express";
import Table from "../../models/table.js";
import multer from "multer";
import { verifyJWT } from "../../middleware/authMiddleware.js";

const upload = multer();
const router = express.Router();

// ========================
// GET all teams (full table, sorted by points)
// ========================
router.get("/", async (req, res) => {
  try {
    const table = await Table.find().sort({ points: -1 });
    res.json(table);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching table",
      error: error.message || error,
    });
  }
});

// ========================
// GET mini table (only team + points)
// ========================
router.get("/mini", async (req, res) => {
  try {
    const table = await Table.find()
      .sort({ points: -1 })
      .select("team points");
    res.json(table);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching mini table",
      error: error.message || error,
    });
  }
});

// ========================
// GET team by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Team not found!" });
    res.json(table);
  } catch (error) {
    console.error("Error in getTeamById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST add new team (Admin only)
// ========================
router.post("/", verifyJWT, upload.none(), async (req, res) => {
  try {
    const {
      team,
      points = 0,
      gamesPlayed = 0,
      wins = 0,
      draws = 0,
      losses = 0,
      goalsFor = 0,
      goalsAgainst = 0,
    } = req.body;

    const newTeam = new Table({
      team,
      points,
      gamesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error adding team", error: error.message });
  }
});

// ========================
// PUT update a team (Admin only)
// ========================
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const {
      team,
      points,
      gamesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
    } = req.body;

    const updatedTeam = await Table.findByIdAndUpdate(
      req.params.id,
      {
        team,
        points,
        gamesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
      },
      { new: true }
    );

    if (!updatedTeam) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error in updateTeam controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE remove a team (Admin only)
// ========================
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team", error });
  }
});

export default router;
