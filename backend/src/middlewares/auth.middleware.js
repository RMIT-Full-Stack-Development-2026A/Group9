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
