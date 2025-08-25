import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Routes
import newsRoutes from "./routes/newsRoutes.js";
import matchRoutes from "./routes/matchesRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // allow your frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend working well 🚀" });
});

// -------------------------
// ROUTES
// -------------------------
app.use("/api/news", newsRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/users", userRoutes);

// -------------------------
// DATABASE CONNECTION (lazy)
// -------------------------
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// -------------------------
// EXPORT FOR VERCEL
// -------------------------
export default app;
