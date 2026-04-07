/**
 * ============================================================================
 * AUTH SESSION MODEL
 * ============================================================================
 * Purpose: Tracks issued auth sessions/tokens in Auth bounded context.
 * This allows token lifecycle control independent from UserAccount/Profile data.
 */

import mongoose from "mongoose";

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: process.env.MONGO_AUTH_SESSION_COLLECTION || "AuthSessions",
  }
);

// TTL index removes expired session documents automatically.
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthSession =
  mongoose.models.AuthSession || mongoose.model("AuthSession", authSessionSchema);

export default AuthSession;
