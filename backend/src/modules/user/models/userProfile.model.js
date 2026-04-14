import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String, // Store Cloudinary URL
      default: "",
      trim: true,
    },
    premiumUntil: {
      type: Date,
      default: null,
      index: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: false,
    collection: process.env.MONGO_USER_PROFILE_COLLECTION || "UserProfiles",
  }
);

const UserProfile =
  mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
