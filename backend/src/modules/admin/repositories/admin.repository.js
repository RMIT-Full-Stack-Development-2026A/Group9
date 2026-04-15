/**
 * ============================================================================
 * ADMIN REPOSITORY (The Vault Manager / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Admin module allowed to talk 
 * directly to the database (MongoDB/Mongoose). It abstracts away the complex 
 * database query languages so the Service layer doesn't have to care about 
 * HOW the data is stored, only THAT it is stored.
 * * Key Responsibilities:
 * 1. Execute CRUD operations (Create, Read, Update, Delete) using Mongoose Models.
 * 2. Handle complex database aggregations or joins (e.g., .populate()).
 * 3. Return raw data back to the Service layer.
 * * CRITICAL RULE: A Repository must NEVER contain business rules (no "if user 
 * is banned, then...") and NEVER know about HTTP. It is a "dumb" worker that 
 * executes database queries exactly as the Service instructs it to.
 */

// Implementation contract:
// 1) Export read/write functions only (no DTO validation and no policy checks).
// 2) Return plain documents/rows; response shaping belongs to service/DTO layers.
// 3) Keep naming convention: find*, list*, create*, update*, delete*.

import mongoose from "mongoose";
import AdminActionLog from "../models/adminActionLog.model.js"; // Adjust path if needed

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
        // Aggregate to join UserProfile and include premiumUntil
        return await getUserModel().aggregate([
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
    }
};