import AdminActionLog from "./adminActionLog.model.js";

export const logAction = (data) => AdminActionLog.create(data);

export const getActionLogs = (filter = {}) =>
  AdminActionLog.find(filter)
    .populate("adminId", "username email")
    .populate("targetUserId", "username email")
    .sort({ createdAt: -1 })
    .lean();

export const getActionLogsByAdmin = (adminId) =>
  AdminActionLog.find({ adminId })
    .sort({ createdAt: -1 })
    .lean();
