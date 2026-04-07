import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isRevoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const AuthToken = mongoose.model("AuthToken", authTokenSchema);
export default AuthToken;
