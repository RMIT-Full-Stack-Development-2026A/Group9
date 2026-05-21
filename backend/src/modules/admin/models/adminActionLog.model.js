
import mongoose from "mongoose";

const ACTION_TYPES = ["DEACTIVATE_USER", "ACTIVATE_USER"];

// Admin action log schema: used to persist a compact audit trail of
// changes performed by admin users. Timestamps only include `createdAt`
// since actions are append-only and updates are not expected.
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
    // Free-form metadata for storing previous-values or contextual info
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

// Indexes to support quick lookup by admin or action type in descending time order
adminActionLogSchema.index({ adminId: 1, createdAt: -1 });
adminActionLogSchema.index({ actionType: 1, createdAt: -1 });

const AdminActionLog =
  mongoose.models.AdminActionLog ||
  mongoose.model("AdminActionLog", adminActionLogSchema);

export { ACTION_TYPES };
export default AdminActionLog;
