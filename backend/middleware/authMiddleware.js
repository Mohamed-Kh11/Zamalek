import jwt from "jsonwebtoken";

// ✅ Verify JWT (from cookie or Authorization header)
export const verifyJWT = (req, res, next) => {
  try {
    // Match cookie name with login route ("token")
    const token =
      req.cookies?.token || (req.header("Authorization") || "").replace("Bearer ", "");

    console.log("Incoming token:", token); // 👈 debug

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

// ✅ Role-based guard
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
