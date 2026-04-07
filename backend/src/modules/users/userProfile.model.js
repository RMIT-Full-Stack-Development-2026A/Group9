import mongoose from "mongoose";

/**
 * UserProfile stores non-sensitive display and gameplay preference data.
 * Its _id is intentionally set to the same value as the associated UserAccount._id,
 * so profile lookups never require a separate foreign-key join — findById(userId) works directly.
 *
 * Security: this model never holds password, role, or isActive data.
 * Avatar uploads, country edits, and wallet operations touch only this collection.
 */
const userProfileSchema = new mongoose.Schema({
  country: { type: String, default: "" },
  avatar: { type: String, default: "" },
  isPremium: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
