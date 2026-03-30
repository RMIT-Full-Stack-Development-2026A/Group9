import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, default: "" },

  role: { type: String, enum: ["player", "admin"], default: "player" },
  isActive: { type: Boolean, default: true },

  avatar: { type: String, default: "" },

  isPremium: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },

  failedLoginAttempts: { type: Number, default: 0 },
  lastFailedLogin: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;