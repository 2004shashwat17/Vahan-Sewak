const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, generateOTP } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/emailService');

const router = express.Router();

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// User registration
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken({ userId: user._id });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
router.post('/login', [
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ userId: user._id });

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Send OTP
router.post('/send-otp', [
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, email } = req.body;

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP (in production, use Redis with expiration)
    otpStore.set(phone, {
      otp,
      createdAt: new Date(),
      attempts: 0
    });

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, phone);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    res.json({
      message: 'OTP sent successfully to your email',
      phone,
      email
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;

    // Get stored OTP
    const storedOTP = otpStore.get(phone);
    if (!storedOTP) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    // Check if OTP is expired (15 minutes)
    const otpAge = new Date() - storedOTP.createdAt;
    if (otpAge > 15 * 60 * 1000) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Check attempts
    if (storedOTP.attempts >= 3) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'Too many attempts. Please request new OTP' });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts += 1;
      otpStore.set(phone, storedOTP);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, remove from store
    otpStore.delete(phone);

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      // Create user with phone number only
      user = new User({
        name: 'User',
        phone,
        password: Math.random().toString(36).slice(-8) // Temporary password
      });
      await user.save();
    }

    // Generate token
    const token = generateToken({ userId: user._id });

    res.json({
      message: 'OTP verified successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    // Remove existing OTP if any
    otpStore.delete(phone);

    // Generate new OTP
    const otp = generateOTP();
    
    // Store new OTP
    otpStore.set(phone, {
      otp,
      createdAt: new Date(),
      attempts: 0
    });

    // In production, integrate with SMS service
    console.log(`New OTP for ${phone}: ${otp}`);

    res.json({
      message: 'OTP resent successfully',
      phone
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
