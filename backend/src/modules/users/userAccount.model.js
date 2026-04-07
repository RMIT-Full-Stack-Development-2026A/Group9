import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * UserAccount stores authentication and authorization data only.
 * Never query this model to build display responses — use UserProfile for that.
 * Security: password hash, role, and active status are isolated here.
 */
const userAccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["player", "admin"], default: "player" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

userAccountSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userAccountSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserAccount = mongoose.model("UserAccount", userAccountSchema);
export default UserAccount;
