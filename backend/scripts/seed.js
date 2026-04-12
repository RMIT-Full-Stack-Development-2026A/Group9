import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserAccount from "../src/modules/user/models/user.model.js";
import UserProfile from "../src/modules/user/models/userProfile.model.js";
import GameSession from "../src/modules/game/models/gameSession.model.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to:", mongoose.connection.name);

  await UserAccount.deleteMany({});
  await UserProfile.deleteMany({});
  await GameSession.deleteMany({});
  console.log("Cleared existing data");

  const defaultPassword = await bcrypt.hash("Pass123!", 12);

  // ── Seed UserAccounts ──────────────────────────────────────────────
  const accountDefs = [
    { username: "Khoa",  email: "khoa@group9.test",  role: "player", createdAt: new Date("2026-03-01T09:00:00Z") },
    { username: "Mia",   email: "mia@group9.test",   role: "player", createdAt: new Date("2026-03-02T10:00:00Z") },
    { username: "Liam",  email: "liam@group9.test",  role: "player", createdAt: new Date("2026-03-03T11:00:00Z") },
    { username: "Anna",  email: "anna@group9.test",   role: "player", createdAt: new Date("2026-03-04T08:00:00Z") },
    { username: "Nam",   email: "nam@group9.test",    role: "player", createdAt: new Date("2026-03-05T14:00:00Z") },
    { username: "Admin", email: "admin@group9.test",  role: "admin",  createdAt: new Date("2026-03-06T12:00:00Z") },
  ];

  const accounts = await UserAccount.insertMany(
    accountDefs.map((a) => ({ ...a, password: defaultPassword, isActive: true }))
  );

  // ── Seed UserProfiles ──────────────────────────────────────────────
  const profileDefs = [
    { country: "Vietnam",    premiumUntil: new Date("2027-12-31"),  walletBalance: 250 },
    { country: "Australia",  premiumUntil: null,                     walletBalance: 60  },
    { country: "Canada",     premiumUntil: null,                     walletBalance: 35  },
    { country: "Japan",      premiumUntil: new Date("2027-06-15"),  walletBalance: 120 },
    { country: "Vietnam",    premiumUntil: null,                     walletBalance: 10  },
    { country: "Singapore",  premiumUntil: new Date("2028-01-01"),  walletBalance: 1000 },
  ];

  await UserProfile.insertMany(
    accounts.map((acc, i) => ({ _id: acc._id, avatar: "", ...profileDefs[i] }))
  );

  const byEmail = Object.fromEntries(accounts.map((a) => [a.email, a]));
  const K = byEmail["khoa@group9.test"]._id;
  const M = byEmail["mia@group9.test"]._id;
  const L = byEmail["liam@group9.test"]._id;
  const A = byEmail["anna@group9.test"]._id;
  const N = byEmail["nam@group9.test"]._id;

  // ── Seed GameSessions ──────────────────────────────────────────────
  await GameSession.insertMany([
    // 1: Khoa vs AI Nova — Khoa wins (Single Player)
    {
      sessionNumber: 1,
      players: [K],
      botName: "AI Nova",
      gameType: "ai",
      boardSize: 3,
      winner: K,
      result: "player1_win",
      startTime: new Date("2026-03-20T10:15:00Z"),
      endTime:   new Date("2026-03-20T10:28:00Z"),
    },
    // 2: Khoa vs Mia online — Mia wins
    {
      sessionNumber: 2,
      players: [K, M],
      gameType: "multiplayer",
      boardSize: 3,
      winner: M,
      result: "player2_win",
      startTime: new Date("2026-03-21T13:00:00Z"),
      endTime:   new Date("2026-03-21T13:24:00Z"),
    },
    // 3: Khoa vs Liam local — draw
    {
      sessionNumber: 3,
      players: [K, L],
      localPlayer2Name: "Liam",
      gameType: "classic",
      boardSize: 3,
      winner: null,
      result: "draw",
      startTime: new Date("2026-03-22T15:00:00Z"),
      endTime:   new Date("2026-03-22T15:30:00Z"),
    },
    // 4: Mia vs AI Titan — Mia wins
    {
      sessionNumber: 4,
      players: [M],
      botName: "AI Titan",
      gameType: "ai",
      boardSize: 3,
      winner: M,
      result: "player1_win",
      startTime: new Date("2026-03-23T08:20:00Z"),
      endTime:   new Date("2026-03-23T08:40:00Z"),
    },
    // 5: Liam vs Mia online — Liam wins
    {
      sessionNumber: 5,
      players: [L, M],
      gameType: "multiplayer",
      boardSize: 3,
      winner: L,
      result: "player1_win",
      startTime: new Date("2026-03-24T17:10:00Z"),
      endTime:   new Date("2026-03-24T17:33:00Z"),
    },
    // 6: Khoa vs AI Nova — aborted
    {
      sessionNumber: 6,
      players: [K],
      botName: "AI Nova",
      gameType: "ai",
      boardSize: 3,
      winner: null,
      result: "aborted",
      startTime: new Date("2026-03-25T19:00:00Z"),
      endTime:   new Date("2026-03-25T19:05:00Z"),
    },
    // 7: Khoa vs Anna online — Khoa wins
    {
      sessionNumber: 7,
      players: [K, A],
      gameType: "multiplayer",
      boardSize: 3,
      winner: K,
      result: "player1_win",
      startTime: new Date("2026-03-26T09:00:00Z"),
      endTime:   new Date("2026-03-26T09:20:00Z"),
    },
    // 8: Khoa vs AI Blaze — Khoa loses
    {
      sessionNumber: 8,
      players: [K],
      botName: "AI Blaze",
      gameType: "ai",
      boardSize: 3,
      winner: null,
      result: "player2_win",
      startTime: new Date("2026-03-27T11:30:00Z"),
      endTime:   new Date("2026-03-27T11:45:00Z"),
    },
    // 9: Khoa vs Nam local — Khoa wins
    {
      sessionNumber: 9,
      players: [K, N],
      localPlayer2Name: "Nam",
      gameType: "classic",
      boardSize: 3,
      winner: K,
      result: "player1_win",
      startTime: new Date("2026-03-28T14:00:00Z"),
      endTime:   new Date("2026-03-28T14:25:00Z"),
    },
    // 10: Khoa vs Mia online — draw
    {
      sessionNumber: 10,
      players: [K, M],
      gameType: "multiplayer",
      boardSize: 3,
      winner: null,
      result: "draw",
      startTime: new Date("2026-03-29T16:00:00Z"),
      endTime:   new Date("2026-03-29T16:18:00Z"),
    },
    // 11: Anna vs AI Nova — Anna wins
    {
      sessionNumber: 11,
      players: [A],
      botName: "AI Nova",
      gameType: "ai",
      boardSize: 3,
      winner: A,
      result: "player1_win",
      startTime: new Date("2026-03-30T10:00:00Z"),
      endTime:   new Date("2026-03-30T10:12:00Z"),
    },
    // 12: Nam vs Liam online — Nam wins
    {
      sessionNumber: 12,
      players: [N, L],
      gameType: "multiplayer",
      boardSize: 3,
      winner: N,
      result: "player1_win",
      startTime: new Date("2026-03-31T12:00:00Z"),
      endTime:   new Date("2026-03-31T12:22:00Z"),
    },
    // 13: Khoa vs Anna local — aborted
    {
      sessionNumber: 13,
      players: [K, A],
      localPlayer2Name: "Anna",
      gameType: "classic",
      boardSize: 3,
      winner: null,
      result: "aborted",
      startTime: new Date("2026-04-01T08:00:00Z"),
      endTime:   new Date("2026-04-01T08:03:00Z"),
    },
    // 14: Khoa vs AI Titan — Khoa wins
    {
      sessionNumber: 14,
      players: [K],
      botName: "AI Titan",
      gameType: "ai",
      boardSize: 3,
      winner: K,
      result: "player1_win",
      startTime: new Date("2026-04-02T20:00:00Z"),
      endTime:   new Date("2026-04-02T20:15:00Z"),
    },
  ]);

  console.log("\nSeed completed successfully!");
  console.log("Created 6 accounts + profiles and 14 game sessions.\n");
  console.log("Login accounts (all use password: Pass123!):");
  accounts.forEach((a) => console.log(`  ${a.email}  (${a.role})`));

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
