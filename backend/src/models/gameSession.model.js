//stores match history, including players, game settings, results, and timestamps.

// {
//   players: [{ type: ObjectId, ref: "User" }],

//   gameType: { type: String, enum: ["single", "local", "online"] },
//   boardSize: { type: Number },

//   winner: { type: ObjectId, ref: "User" },
//   result: { type: String, enum: ["win", "lose", "draw", "aborted"] },

//   startTime: { type: Date },
//   endTime: { type: Date },

//   moves: [{ type: ObjectId, ref: "Move" }]
// }