import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error.message);
    console.error("URI:", process.env.MONGO_URI?.substring(0, 50) + "...");
    process.exit(1);
  }
};

export default connectDB;