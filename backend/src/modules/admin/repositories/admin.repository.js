

import mongoose from "mongoose";
import AdminActionLog from "../models/adminActionLog.model.js";

const getUserModel = () => mongoose.model("UserAccount");
const getRoomModel = () => mongoose.model("GameRoom");

export const adminRepository = {
   
    countTotalUsers: async () => {
        return await getUserModel().countDocuments();
    },

    countActiveRooms: async () => {
        return await getRoomModel().countDocuments({ status: { $ne: "CLOSED" } });
    },

    
    findAllUsers: async () => {
        // Aggregate to join UserProfile and include premiumUntil, filter only players
        return await getUserModel().aggregate([
            { $match: { role: "player" } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "UserProfiles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "profile"
                }
            },
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } }
        ]);
    },

    findUserById: async (userId) => {
        return await getUserModel().findById(userId).lean();
    },

    updateUserDeactivationStatus: async (userId, isDeactivated) => {
        return await getUserModel().findByIdAndUpdate(
            userId,
            { isDeactivated },
            { new: true }
        ).lean();
    },

  
    findAllRooms: async () => {
        return await getRoomModel()
            .find({ status: { $ne: "CLOSED" } })
            .populate("player1 player2", "username") 
            .sort({ createdAt: -1 })
            .lean();
    },

    findRoomById: async (roomId) => {
        return await getRoomModel().findById(roomId).lean();
    },

    updateRoomStatus: async (roomId, status) => {
        return await getRoomModel().findByIdAndUpdate(
            roomId,
            { status },
            { new: true }
        ).lean();
    },

    
    createActionLog: async (logData) => {
        const log = new AdminActionLog(logData);
        return await log.save();
    },

    countTotalUsers: async () => {
        return await getUserModel().countDocuments();
    },

    countActiveRooms: async () => {
        return await getRoomModel().countDocuments({ status: { $ne: "CLOSED" } });
    },

    countActiveAccounts: async () => {
        // Only players who are not deactivated
        return await getUserModel().countDocuments({ role: "player", isDeactivated: { $ne: true } });
    },

    countInactiveAccounts: async () => {
        // Only players who are deactivated
        return await getUserModel().countDocuments({ role: "player", isDeactivated: true });
    },

    countPremiumUsers: async () => {
        // Join UserProfile and count where premiumUntil is in the future
        const result = await getUserModel().aggregate([
            { $match: { role: "player" } },
            {
                $lookup: {
                    from: "UserProfiles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "profile"
                }
            },
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: false } },
            {
                $match: {
                    "profile.premiumUntil": { $gt: new Date() }
                }
            },
            { $count: "premiumCount" }
        ]);
        return result[0]?.premiumCount || 0;
    },
};