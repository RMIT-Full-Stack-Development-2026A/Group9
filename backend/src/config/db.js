import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Your URI is:", process.env.MONGO_URI); 
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;