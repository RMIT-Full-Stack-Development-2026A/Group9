
// Authentication middleware for Express.js
// - Checks for a Bearer token in the Authorization header
// - Verifies the JWT using the configured secret
// - Checks if the token is revoked
// - Attaches authentication info to req.auth if valid
// - Responds with 401 Unauthorized if any check fails
import jwt from "jsonwebtoken";
import { isTokenRevoked } from "../modules/auth/auth.tokenStore.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

    if (isTokenRevoked(decoded.jti)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.auth = {
      token,
      userId: decoded.sub,
      role: decoded.role,
      jti: decoded.jti,
      exp: decoded.exp,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
