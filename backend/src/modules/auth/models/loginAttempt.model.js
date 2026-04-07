import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    success: {
      type: Boolean,
      required: true,
      index: true,
    },
    attemptTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: process.env.MONGO_LOGIN_ATTEMPT_COLLECTION || "LoginAttempts",
  }
);

loginAttemptSchema.index({ userId: 1, attemptTime: -1 });

const LoginAttempt =
  mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;
