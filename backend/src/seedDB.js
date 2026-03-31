import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./modules/users/user.model.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4 
    });
    console.log("Connected to DB for seeding...");

    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const seedUsers = [
      {
        username: "admin_user",
        email: "admin@tictactoang.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        username: "player_a",
        email: "player_a@gmail.com",
        password: hashedPassword,
        role: "player",
        isPremium: true,
      },
      {
        username: "player_b",
        email: "player_b@gmail.com",
        password: hashedPassword,
        role: "player",
        isPremium: false,
      }
    ];

    await User.insertMany(seedUsers);
    console.log("Database Seeded! You can now log in with:");
    console.log("User: player_a / Pass: Password123!");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();