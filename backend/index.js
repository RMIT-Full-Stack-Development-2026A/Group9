import 'dotenv/config'; 
import connectDB from './src/config/db.js';
connectDB();
import "./src/server.js";