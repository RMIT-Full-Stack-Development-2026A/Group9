import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  role: { type: String, enum: ['player', 'admin'], default: 'player' },
  isActive: { type: Boolean, default: true },
  avatar: { type: Buffer, default: null },
  premiumUntil: { type: Date, default: null },
  walletBalance: { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  lastFailedLogin: { type: Date, default: null }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
