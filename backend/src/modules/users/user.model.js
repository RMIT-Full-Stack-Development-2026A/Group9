//stores account, authentication, and profile information for players and admins

// {
//   username: { type: String },
//   email: { type: String, unique: true },
//   password: { type: String }, // hashed
//   country: { type: String },

//   role: { type: String, enum: ["player", "admin"] },
//   isActive: { type: Boolean },

//   avatar: { type: String },

//   isPremium: { type: Boolean },
//   walletBalance: { type: Number },

//   failedLoginAttempts: { type: Number },
//   lastFailedLogin: { type: Date },

//   createdAt: { type: Date }
// }