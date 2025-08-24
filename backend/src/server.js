import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import newsRoutes from "./routes/newsRoutes.js";
import matchRoutes from "./routes/matchesRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Working well " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
// PRODUCTION: serve CRA build
// -------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// -------------------------
// DATABASE CONNECTION
// -------------------------
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
