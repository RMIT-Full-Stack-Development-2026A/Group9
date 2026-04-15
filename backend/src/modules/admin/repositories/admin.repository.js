

import mongoose from "mongoose";
import AdminActionLog from "../models/adminActionLog.model.js";

const getUserModel = () => mongoose.model("UserAccount");
const getRoomModel = () => mongoose.model("GameRoom");

export const adminRepository = {
   
    countTotalUsers: async () => {
        return await getUserModel().countDocuments({ role: "player" });
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

    updateUserActiveStatus: async (userId, isActive) => {
        await getUserModel().findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        );
        // Ensure userId is an ObjectId
        const objectId = (typeof userId === 'string' || typeof userId === 'number') ? new mongoose.Types.ObjectId(userId) : userId;
        const users = await getUserModel().aggregate([
            { $match: { _id: objectId } },
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
        // Debug log removed
        if (!users[0]) {
            throw new Error('User not found after update. objectId: ' + objectId);
        }
        return users[0];
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

    countActiveRooms: async () => {
        return await getRoomModel().countDocuments({ status: { $ne: "CLOSED" } });
    },

    countActiveAccounts: async () => {
        // Only players who are active
        return await getUserModel().countDocuments({ role: "player", isActive: true });
    },

    countInactiveAccounts: async () => {
        // Only players who are inactive
        return await getUserModel().countDocuments({ role: "player", isActive: false });
    },

    countPremiumUsers: async () => {
        // Join UserProfile and count where premiumUntil is in the future (handle string or Date)
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
                $addFields: {
                    premiumUntilDate: { $toDate: "$profile.premiumUntil" }
                }
            },
            {
                $match: {
                    premiumUntilDate: { $gt: new Date() }
                }
            },
            { $count: "premiumCount" }
        ]);
        return result[0]?.premiumCount || 0;
    },
};