import mongoose from "mongoose";

const adminActionLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount", required: true },
  actionType: {
    type: String,
    enum: ["DEACTIVATE_USER", "ACTIVATE_USER", "CLOSE_ROOM"],
    required: true,
  },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount", default: null },
  targetRoomId: { type: mongoose.Schema.Types.ObjectId, default: null },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const AdminActionLog = mongoose.model("AdminActionLog", adminActionLogSchema);
export default AdminActionLog;
