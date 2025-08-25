import jwt from "jsonwebtoken";

// ✅ Verify JWT (from cookie or Authorization header)
export const verifyJWT = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || (req.header("Authorization") || "").replace("Bearer ", "");

    console.log("Incoming token:", token); // 👈 debug

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // e.g. { id: "...", email: "...", ... }
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

// ✅ Authenticated-only guard (no role check)
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};
