require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const User = require('../src/models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Registration Route 
app.post('/api/register', async (req, res) => {
  const { username, email, password, country } = req.body;
  
  // Backend Validation (Medium & Ultimo Requirements)
  const errors = [];
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({
      error: 'Invalid Email Format',
      cause: 'The email address is missing a valid domain or "@" symbol.',
      examples: 'player1@gmail.com, admin@domain.net'
    });
  }

  // At least 8 chars, 1 number, 1 special char, 1 capital letter
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@!])[A-Za-z\d$#@!]{8,}$/;
  if (!passRegex.test(password)) {
    errors.push({
      error: 'Weak Password',
      cause: 'Password lacks required complexity (needs 8+ chars, 1 uppercase, 1 number, 1 special character).',
      examples: 'Str0ngP@ssw0rd!, G@mer2026#'
    });
  }

  // Ultimo: API Error Responses (Return exact detailed format if validation fails)
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    // 2. Security (Simplex Requirements)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        errors: [{ 
          error: 'Email Already Registered', 
          cause: 'An account with this email already exists in the database.', 
          examples: 'Use a different email address or log in to your existing account.' 
        }] 
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save the new user
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      country 
    });
    
    await newUser.save();

    res.status(201).json({ message: "Registration Successful" });
  } catch (err) {
    console.error('Server error during registration:', err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Server Initialization 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});