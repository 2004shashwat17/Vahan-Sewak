const express = require('express');
const { query, validationResult } = require('express-validator');
const Mechanic = require('../models/Mechanic');

const router = express.Router();

// Get nearby mechanics
router.get('/nearby', [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  query('radius').optional().isFloat({ min: 1, max: 50 }).withMessage('Radius must be between 1 and 50 km'),
  query('specialization').optional().isIn(['Engine Expert', 'All Repairs', 'Electrical & AC', 'Tyre Specialist', 'General']).withMessage('Invalid specialization')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, radius = 10, specialization } = req.query;

    // Build query
    const query = {
      isAvailable: true,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    };

    if (specialization) {
      query.specialization = specialization;
    }

    const mechanics = await Mechanic.find(query)
      .select('name specialization rating totalReviews serviceCharge currentLocation averageResponseTime')
      .limit(20);

    // Calculate distance and ETA for each mechanic
    const mechanicsWithDetails = mechanics.map(mechanic => {
      const distance = calculateDistance(
        latitude, longitude,
        mechanic.location.coordinates[1],
        mechanic.location.coordinates[0]
      );

      const eta = Math.ceil(distance * 2 + mechanic.averageResponseTime); // Rough ETA calculation

      return {
        _id: mechanic._id,
        name: mechanic.name,
        specialization: mechanic.specialization,
        rating: mechanic.rating,
        reviews: mechanic.totalReviews,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        eta,
        serviceCharge: mechanic.serviceCharge,
        location: mechanic.currentLocation
      };
    });

    // Sort by distance
    mechanicsWithDetails.sort((a, b) => a.distance - b.distance);

    res.json({
      mechanics: mechanicsWithDetails,
      total: mechanicsWithDetails.length
    });
  } catch (error) {
    console.error('Get nearby mechanics error:', error);
    res.status(500).json({ error: 'Failed to get nearby mechanics' });
  }
});

// Get mechanic by ID
router.get('/:id', async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id)
      .select('-password -documents -bankDetails');

    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }

    if (!mechanic.isActive) {
      return res.status(404).json({ error: 'Mechanic not available' });
    }

    res.json({
      mechanic: mechanic.getPublicProfile()
    });
  } catch (error) {
    console.error('Get mechanic error:', error);
    res.status(500).json({ error: 'Failed to get mechanic' });
  }
});

// Get mechanic reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const mechanic = await Mechanic.findById(req.params.id)
      .populate('reviews.userId', 'name')
      .select('reviews');

    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const reviews = mechanic.reviews.slice(startIndex, endIndex);

    res.json({
      reviews,
      totalPages: Math.ceil(mechanic.reviews.length / limit),
      currentPage: parseInt(page),
      total: mechanic.reviews.length
    });
  } catch (error) {
    console.error('Get mechanic reviews error:', error);
    res.status(500).json({ error: 'Failed to get mechanic reviews' });
  }
});

// Get mechanics by specialization
router.get('/specialization/:specialization', [
  query('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  query('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  query('radius').optional().isFloat({ min: 1, max: 50 }).withMessage('Radius must be between 1 and 50 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { specialization } = req.params;
    const { latitude, longitude, radius = 10 } = req.query;

    let query = {
      specialization,
      isAvailable: true,
      isActive: true
    };

    // Add location filter if coordinates provided
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000
        }
      };
    }

    const mechanics = await Mechanic.find(query)
      .select('name specialization rating totalReviews serviceCharge currentLocation averageResponseTime')
      .limit(20);

    const mechanicsWithDetails = mechanics.map(mechanic => {
      let distance = null;
      let eta = null;

      if (latitude && longitude) {
        distance = calculateDistance(
          latitude, longitude,
          mechanic.location.coordinates[1],
          mechanic.location.coordinates[0]
        );
        eta = Math.ceil(distance * 2 + mechanic.averageResponseTime);
      }

      return {
        _id: mechanic._id,
        name: mechanic.name,
        specialization: mechanic.specialization,
        rating: mechanic.rating,
        reviews: mechanic.totalReviews,
        distance: distance ? Math.round(distance * 10) / 10 : null,
        eta,
        serviceCharge: mechanic.serviceCharge,
        location: mechanic.currentLocation
      };
    });

    // Sort by rating if no location provided, otherwise by distance
    if (latitude && longitude) {
      mechanicsWithDetails.sort((a, b) => a.distance - b.distance);
    } else {
      mechanicsWithDetails.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      mechanics: mechanicsWithDetails,
      total: mechanicsWithDetails.length
    });
  } catch (error) {
    console.error('Get mechanics by specialization error:', error);
    res.status(500).json({ error: 'Failed to get mechanics' });
  }
});

// Get all specializations
router.get('/specializations/list', async (req, res) => {
  try {
    const specializations = await Mechanic.distinct('specialization', { isActive: true });
    res.json({
      specializations
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ error: 'Failed to get specializations' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
