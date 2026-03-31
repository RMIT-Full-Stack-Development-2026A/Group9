import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

class AuthService {
  async login(identifier, password) {
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });

    if (!user) throw new Error("User not found");

    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new Error("Account temporarily locked. Try again in 60s.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: { username: user.username, role: user.role, email: user.email }
    };
  }
}

export default new AuthService();