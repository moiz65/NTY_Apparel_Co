// src/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRY = '7d';

// Helper: Generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

// Helper: Get User Role
const getUserRole = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT role FROM users WHERE id = ?',
    [userId]
  );
  const users = Array.isArray(rows) ? rows : [];
  return users[0]?.role || 'customer';
};

// ✅ Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters.',
      });
    }

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, role, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [name.trim(), email.toLowerCase(), hashedPassword, 'customer']
    );

    const userId = result && result.insertId ? result.insertId : null;

    // Generate token
    const token = generateToken(userId, email.toLowerCase(), 'customer');

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: {
          id: userId,
          name: name.trim(),
          email: email.toLowerCase(),
          role: 'customer',
        },
        token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.',
    });
  }
});

// ✅ Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    // Get user
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    const users = Array.isArray(rows) ? rows : [];
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      message: 'Welcome back!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign in. Please try again.',
    });
  }
});

// ✅ Get Current User (from token)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const [rows] = await pool.execute(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      const users = Array.isArray(rows) ? rows : [];
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: {
          user: users[0],
          token,
        },
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
    });
  }
});

// ✅ Check if user is admin
router.get('/check-role/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const role = await getUserRole(parseInt(userId, 10));

    res.json({
      success: true,
      isAdmin: role === 'admin',
      role,
    });
  } catch (error) {
    console.error('Check role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check role',
    });
  }
});

export default router;