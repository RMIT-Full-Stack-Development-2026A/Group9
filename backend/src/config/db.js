import mongoose from "mongoose";

// connectDB: establishes a connection to MongoDB using the
// `MONGO_URI` environment variable. This function is async and
// will throw/log and terminate the process if the connection
// cannot be established — that's intentional so the app doesn't
// run in a broken state without a database.
const connectDB = async () => {
  try {
    // Read the Mongo connection string from env: MONGO_URI
    // Example: mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/dbname
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Helpful startup logs for debugging connection target
    console.log("MongoDB connected");
    console.log("Connected to DB:", conn.connection.name);
    console.log("Host:", conn.connection.host);
  } catch (error) {
    // If DB connection fails, log the error and exit the process
    // so the orchestration platform (or developer) can detect
    // a failed start and restart or fix the configuration.
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;