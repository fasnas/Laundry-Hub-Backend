import jwt from "jsonwebtoken";

export const authorisation = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // store full id and role
    req.user = {
      id: decoded.userId,
      role: decoded.role,   // keep the role string
    };

    // ✅ allow only "laundry" role
    if (req.user.role !== "laundry") {
      return res.status(403).json({ message: "Access denied: Laundry only" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
