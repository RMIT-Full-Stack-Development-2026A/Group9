
//THIS IS THE FILE I USE TO SEED THE DB SO DONT TOUCH IT FOR NOW UNTIL WE FINISH TESTING


import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./modules/users/user.model.js";

dotenv.config({ path: "../.env" });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4 
    });
    console.log("connected to db");

    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    const seedUsers = [
      {
        username: "admin",
        email: "admin@tictactoang.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        username: "player1",
        email: "player1@gmail.com",
        password: hashedPassword,
        role: "player",
        isPremium: true,
      },
      
    ];

    await User.insertMany(seedUsers);
    console.log("db seeded successfully");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();