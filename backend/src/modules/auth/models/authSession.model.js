
import mongoose from "mongoose";

// Schema for server-side stored auth sessions. Notes:
// - `token` holds a hashed digest (never store raw JWTs)
// - `expiresAt` is used by a TTL index to automatically purge expired sessions
// - `isRevoked` allows safely invalidating sessions without waiting for expiry
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
