const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.patch('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('address').optional().isObject().withMessage('Address must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add vehicle
router.post('/vehicles', [
  body('make').trim().notEmpty().withMessage('Vehicle make is required'),
  body('model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('color').optional().trim().notEmpty().withMessage('Color must not be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { make, model, year, registrationNumber, color } = req.body;
    const user = await User.findById(req.user._id);

    // Check if vehicle already exists
    const existingVehicle = user.vehicles.find(
      v => v.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
    );
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle with this registration number already exists' });
    }

    user.vehicles.push({
      make,
      model,
      year: year.toString(),
      registrationNumber,
      color
    });

    await user.save();

    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicles: user.vehicles
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Get user vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      vehicles: user.vehicles
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to get vehicles' });
  }
});

// Update vehicle
router.patch('/vehicles/:vehicleId', [
  body('make').optional().trim().notEmpty().withMessage('Vehicle make must not be empty'),
  body('model').optional().trim().notEmpty().withMessage('Vehicle model must not be empty'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year'),
  body('registrationNumber').optional().trim().notEmpty().withMessage('Registration number must not be empty'),
  body('color').optional().trim().notEmpty().withMessage('Color must not be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vehicleId } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user._id);

    const vehicleIndex = user.vehicles.findIndex(v => v._id.toString() === vehicleId);
    if (vehicleIndex === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Update vehicle
    Object.keys(updates).forEach(key => {
      if (key === 'year') {
        user.vehicles[vehicleIndex][key] = updates[key].toString();
      } else {
        user.vehicles[vehicleIndex][key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: 'Vehicle updated successfully',
      vehicle: user.vehicles[vehicleIndex]
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete vehicle
router.delete('/vehicles/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const user = await User.findById(req.user._id);

    const vehicleIndex = user.vehicles.findIndex(v => v._id.toString() === vehicleId);
    if (vehicleIndex === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    user.vehicles.splice(vehicleIndex, 1);
    await user.save();

    res.json({
      message: 'Vehicle deleted successfully',
      vehicles: user.vehicles
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Update user preferences
router.patch('/preferences', [
  body('notifications').optional().isBoolean().withMessage('Notifications must be a boolean'),
  body('language').optional().isIn(['en', 'hi']).withMessage('Language must be en or hi')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { notifications, language } = req.body;
    const user = await User.findById(req.user._id);

    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (language) user.preferences.language = language;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get user preferences
router.get('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

module.exports = router;
