import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  success: { type: Boolean, required: true },
  attemptTime: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);
export default LoginAttempt;
