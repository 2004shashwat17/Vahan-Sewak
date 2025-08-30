const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const Razorpay = require('razorpay');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Process inspection fee payment
router.post('/inspection-fee', [
  body('serviceRequestId').isMongoId().withMessage('Invalid service request ID'),
  body('paymentMethod').isIn(['upi', 'card', 'wallet']).withMessage('Invalid payment method'),
  body('amount').isFloat({ min: 0 }).withMessage('Invalid amount')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceRequestId, paymentMethod, amount } = req.body;

    // Find service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if payment is already made
    if (serviceRequest.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Validate amount
    if (amount !== serviceRequest.inspectionFee) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
    // For now, simulate successful payment
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update service request
    serviceRequest.paymentStatus = 'paid';
    serviceRequest.inspectionFee = amount;
    await serviceRequest.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('payment-successful', {
      serviceRequestId: serviceRequest._id,
      amount,
      transactionId
    });

    res.json({
      message: 'Payment successful',
      transactionId,
      amount,
      serviceRequest
    });
  } catch (error) {
    console.error('Process inspection fee error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Process final payment
router.post('/final-payment', [
  body('serviceRequestId').isMongoId().withMessage('Invalid service request ID'),
  body('paymentMethod').isIn(['upi', 'card', 'wallet']).withMessage('Invalid payment method'),
  body('amount').isFloat({ min: 0 }).withMessage('Invalid amount')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceRequestId, paymentMethod, amount } = req.body;

    // Find service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId)
      .populate('mechanicId', 'serviceCharge');
    
    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if service is completed
    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({ error: 'Service must be completed before final payment' });
    }

    // Calculate total amount
    const totalAmount = serviceRequest.inspectionFee + (serviceRequest.mechanicId?.serviceCharge || 0);
    
    if (amount !== totalAmount) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    // In production, integrate with payment gateway
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update service request
    serviceRequest.totalAmount = totalAmount;
    serviceRequest.serviceCharge = serviceRequest.mechanicId?.serviceCharge || 0;
    await serviceRequest.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`user-${req.user._id}`).emit('final-payment-successful', {
      serviceRequestId: serviceRequest._id,
      amount: totalAmount,
      transactionId
    });

    res.json({
      message: 'Final payment successful',
      transactionId,
      amount: totalAmount,
      serviceRequest
    });
  } catch (error) {
    console.error('Process final payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const serviceRequests = await ServiceRequest.find({
      userId: req.user._id,
      paymentStatus: 'paid'
    })
    .populate('mechanicId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await ServiceRequest.countDocuments({
      userId: req.user._id,
      paymentStatus: 'paid'
    });

    const paymentHistory = serviceRequests.map(request => ({
      id: request._id,
      date: request.createdAt,
      amount: request.totalAmount || request.inspectionFee,
      type: request.totalAmount ? 'Final Payment' : 'Inspection Fee',
      mechanic: request.mechanicId?.name || 'N/A',
      status: request.status
    }));

    res.json({
      paymentHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

// Get payment details for service request
router.get('/service-request/:serviceRequestId', async (req, res) => {
  try {
    const { serviceRequestId } = req.params;

    const serviceRequest = await ServiceRequest.findById(serviceRequestId)
      .populate('mechanicId', 'name serviceCharge');

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const paymentDetails = {
      serviceRequestId: serviceRequest._id,
      inspectionFee: serviceRequest.inspectionFee,
      serviceCharge: serviceRequest.mechanicId?.serviceCharge || 0,
      totalAmount: serviceRequest.totalAmount || serviceRequest.inspectionFee,
      paymentStatus: serviceRequest.paymentStatus,
      mechanic: serviceRequest.mechanicId?.name || null,
      status: serviceRequest.status
    };

    res.json({
      paymentDetails
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Failed to get payment details' });
  }
});

// Request refund
router.post('/refund', [
  body('serviceRequestId').isMongoId().withMessage('Invalid service request ID'),
  body('reason').trim().isLength({ min: 10 }).withMessage('Refund reason must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceRequestId, reason } = req.body;

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Check if user owns this request
    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if payment was made
    if (serviceRequest.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'No payment found to refund' });
    }

    // Check if service can be refunded
    if (serviceRequest.status === 'completed') {
      return res.status(400).json({ error: 'Cannot refund completed service' });
    }

    // In production, process refund through payment gateway
    const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update service request
    serviceRequest.paymentStatus = 'refunded';
    await serviceRequest.save();

    res.json({
      message: 'Refund request submitted successfully',
      refundId,
      amount: serviceRequest.totalAmount || serviceRequest.inspectionFee,
      reason
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ error: 'Failed to process refund request' });
  }
});

// Create Razorpay order
router.post('/create-order', [
  body('amount').isInt({ min: 1 }).withMessage('Invalid amount'),
  body('currency').isIn(['INR']).withMessage('Invalid currency'),
  body('paymentMethod').isIn(['upi', 'card', 'wallet']).withMessage('Invalid payment method'),
  body('problem').trim().notEmpty().withMessage('Problem description is required'),
  body('mobileNumber').isMobilePhone('en-IN').withMessage('Invalid mobile number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, paymentMethod, problem, mobileNumber } = req.body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `VahanSewak_${Date.now()}`,
      notes: {
        problem: problem,
        mobileNumber: mobileNumber,
        paymentMethod: paymentMethod
      }
    });

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', [
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
  body('amount').isInt({ min: 1 }).withMessage('Invalid amount'),
  body('problem').trim().notEmpty().withMessage('Problem description is required'),
  body('mobileNumber').isMobilePhone('en-IN').withMessage('Invalid mobile number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      amount, 
      problem, 
      mobileNumber 
    } = req.body;

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Payment is verified - create service request
    const serviceRequest = new ServiceRequest({
      userId: 'temp-user', // Will be updated when user system is implemented
      problemType: problem,
      problemDescription: problem,
      status: 'pending',
      priority: 'normal',
      location: {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates
      },
      vehicle: {
        type: 'Unknown',
        model: 'Unknown'
      },
      inspectionFee: amount,
      paymentStatus: 'paid',
      assignedAt: new Date()
    });

    await serviceRequest.save();

    res.json({
      message: 'Payment verified successfully',
      serviceRequestId: serviceRequest._id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
