const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const Mechanic = require('../models/Mechanic');

const router = express.Router();

// Create service request
router.post('/', [
  body('problemType').isIn([
    'tyre_puncture',
    'unknown_warnings',
    'heating_problem',
    'ac_not_working',
    'heater_not_working',
    'engine_oil',
    'steering_axle',
    'steering_oil',
    'windshield_change',
    'other'
  ]).withMessage('Invalid problem type'),
  body('problemDescription').trim().isLength({ min: 10 }).withMessage('Problem description must be at least 10 characters'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      problemType,
      problemDescription,
      photos,
      video,
      location,
      vehicle,
      isEmergency
    } = req.body;

    // Create service request
    const serviceRequest = new ServiceRequest({
      userId: req.user._id,
      problemType,
      problemDescription,
      photos: photos || [],
      video: video || null,
      location,
      vehicle,
      isEmergency: isEmergency || false,
      priority: isEmergency ? 'emergency' : 'medium'
    });

    await serviceRequest.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('new-service-request', {
      serviceRequest: serviceRequest,
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Service request created successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Create service request error:', error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// Get user's service requests
router.get('/my-requests', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const serviceRequests = await ServiceRequest.find(query)
      .populate('mechanicId', 'name specialization rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ServiceRequest.countDocuments(query);

    res.json({
      serviceRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({ error: 'Failed to get service requests' });
  }
});

// Get service request by ID
router.get('/:id', async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('mechanicId', 'name specialization rating phone');

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request or is assigned mechanic
    if (serviceRequest.userId.toString() !== req.user._id.toString() && 
        serviceRequest.mechanicId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ serviceRequest });
  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({ error: 'Failed to get service request' });
  }
});

// Update service request status
router.patch('/:id/status', [
  body('status').isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check permissions
    if (serviceRequest.userId.toString() !== req.user._id.toString() && 
        serviceRequest.mechanicId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update status
    await serviceRequest.updateStatus(status, notes);

    // Emit socket event
    const io = req.app.get('io');
    io.to(`user-${serviceRequest.userId}`).emit('service-status-update', {
      serviceRequestId: serviceRequest._id,
      status,
      notes
    });

    res.json({
      message: 'Service request status updated',
      serviceRequest
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Assign mechanic to service request
router.patch('/:id/assign-mechanic', [
  body('mechanicId').isMongoId().withMessage('Invalid mechanic ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mechanicId } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if mechanic exists and is available
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic || !mechanic.isAvailable) {
      return res.status(400).json({ error: 'Mechanic not available' });
    }

    // Assign mechanic
    await serviceRequest.assignMechanic(mechanicId);

    // Emit socket events
    const io = req.app.get('io');
    io.to(`user-${serviceRequest.userId}`).emit('mechanic-assigned', {
      serviceRequestId: serviceRequest._id,
      mechanic: mechanic.getPublicProfile()
    });

    io.to(`mechanic-${mechanicId}`).emit('new-assignment', {
      serviceRequest
    });

    res.json({
      message: 'Mechanic assigned successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Assign mechanic error:', error);
    res.status(500).json({ error: 'Failed to assign mechanic' });
  }
});

// Rate service request
router.post('/:id/rate', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if service is completed
    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({ error: 'Can only rate completed services' });
    }

    // Add rating
    await serviceRequest.addRating(rating, comment);

    // Update mechanic's average rating
    if (serviceRequest.mechanicId) {
      const mechanic = await Mechanic.findById(serviceRequest.mechanicId);
      if (mechanic) {
        mechanic.rating = mechanic.calculateAverageRating();
        mechanic.totalReviews = mechanic.reviews.length;
        await mechanic.save();
      }
    }

    res.json({
      message: 'Service rated successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Rate service error:', error);
    res.status(500).json({ error: 'Failed to rate service' });
  }
});

// Cancel service request
router.post('/:id/cancel', [
  body('reason').trim().isLength({ min: 5 }).withMessage('Cancellation reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if service can be cancelled
    if (['completed', 'cancelled'].includes(serviceRequest.status)) {
      return res.status(400).json({ error: 'Service cannot be cancelled' });
    }

    // Cancel service
    await serviceRequest.cancelRequest(reason, 'user');

    // Emit socket event
    const io = req.app.get('io');
    if (serviceRequest.mechanicId) {
      io.to(`mechanic-${serviceRequest.mechanicId}`).emit('service-cancelled', {
        serviceRequestId: serviceRequest._id,
        reason
      });
    }

    res.json({
      message: 'Service cancelled successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Cancel service error:', error);
    res.status(500).json({ error: 'Failed to cancel service' });
  }
});

module.exports = router;
