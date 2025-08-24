import express from "express";
import News from "../../models/News.js";
import upload from "../../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { verifyJWT } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Helper: upload image to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "zamalek-news" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// CREATE (Admin only)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const { title, content} = req.body;
    const news = new News({
      title,
      content,
      image: imageUrl,
      publishedAt: new Date(),
    });

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ (Public)
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (!news) return res.status(404).json({ message: "news not found!" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE (Admin only)
router.patch("/:id", verifyJWT, upload.single("image"), async (req, res) => {
  try {
    let updates = { ...req.body };

    // if new image provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updates.image = result.secure_url;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "News not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (Admin only)
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
