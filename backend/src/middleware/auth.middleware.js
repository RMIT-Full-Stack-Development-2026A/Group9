import jwt from "jsonwebtoken";
import * as userFacade from "../modules/users/user.facade.js";
import { isTokenBlacklisted } from "../shared/security/tokenBlacklistService.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // Check if token has been blacklisted (Req 2.3.2)
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been revoked. Please log in again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const user = await userFacade.getUserForAuth(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated" });
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
