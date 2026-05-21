

import mongoose from "mongoose";
import AdminActionLog from "../models/adminActionLog.model.js";
import { adminDto } from "../dto/admin.dto.js";

const getUserModel = () => mongoose.model("UserAccount");

export const adminRepository = {
   
    countTotalUsers: async () => {
        return await getUserModel().countDocuments({ role: "player" });
    },

    
    findAllUsers: async () => {
        // Aggregate to join the UserProfile document and return a
        // denormalized result. This allows the admin UI to show profile
        // fields (like premiumUntil) alongside the account document.
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
            // Use unwind with preserveNull to avoid dropping accounts
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } }
        ]);
    },

    // Return a lean user doc (no mongoose getter/setter overhead)
    findUserById: async (userId) => {
        return await getUserModel().findById(userId).lean();
    },

    // Update active flag, then re-query using aggregation to return
    // the denormalized shape expected by the admin DTO.
    updateUserActiveStatus: async (userId, isActive) => {
        await getUserModel().findByIdAndUpdate(
            userId,
            { isActive },
            { returnDocument: "after" }
        );
        // Ensure userId is an ObjectId for aggregation match
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
        if (!users[0]) {
            throw new Error('User not found after update. objectId: ' + objectId);
        }
        return users[0];
    },

  
    // Persist an admin action log for auditing
    createActionLog: async (logData) => {
        const log = new AdminActionLog(logData);
        return await log.save();
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
        // Count players whose profile.premiumUntil is a future date.
        // Uses $toDate to defensively handle string or Date storage.
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