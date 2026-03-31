//stores account, authentication, and profile information for players and admins

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed 
  country: { type: String },
  role: { type: String, enum: ["player", "admin"], default: "player" },
  isActive: { type: Boolean, default: true },
  avatar: { type: String },
  isPremium: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  
  //bruteforce protection fields 
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
}, { timestamps: true });

//hashes password before saving 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);