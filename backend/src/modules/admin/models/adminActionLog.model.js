/**
 * ============================================================================
 * ADMIN ACTION LOG MODEL
 * ============================================================================
 * Purpose: Dedicated admin-bounded-context audit model. Keeps moderation/system
 * actions separate from User data while still referencing users/rooms.
 */

import mongoose from "mongoose";

const ACTION_TYPES = ["DEACTIVATE_USER", "ACTIVATE_USER", "CLOSE_ROOM"];

const adminActionLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: ACTION_TYPES,
      required: true,
      index: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      default: null,
      index: true,
    },
    targetRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameRoom",
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: process.env.MONGO_ADMIN_ACTION_LOG_COLLECTION || "AdminActionLogs",
  }
);

adminActionLogSchema.index({ adminId: 1, createdAt: -1 });
adminActionLogSchema.index({ actionType: 1, createdAt: -1 });

const AdminActionLog =
  mongoose.models.AdminActionLog ||
  mongoose.model("AdminActionLog", adminActionLogSchema);

export { ACTION_TYPES };
export default AdminActionLog;
