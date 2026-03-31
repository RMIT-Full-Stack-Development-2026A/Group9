import express from 'express';
import bcrypt from 'bcrypt';
// import User from '../../models/User.js';
import User from '../users/user.model.js';

const router = express.Router();

// Route: POST /api/register
router.post('/register', async (req, res) => {
  const { username, email, password, country } = req.body;
  
  // 1. Backend Validation (Medium & Ultimo Requirements)
  const errors = [];
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({
      error: 'Invalid Email Format',
      cause: 'The email address is missing a valid domain or "@" symbol.',
      examples: 'player1@gmail.com, admin@domain.net'
    });
  }

  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@!])[A-Za-z\d$#@!]{8,}$/;
  if (!passRegex.test(password)) {
    errors.push({
      error: 'Weak Password',
      cause: 'Password lacks required complexity (needs 8+ chars, 1 uppercase, 1 number, 1 special character).',
      examples: 'Str0ngP@ssw0rd!, G@mer2026#'
    });
  }

  // Ultimo: API Error Responses 
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user
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

export default router;