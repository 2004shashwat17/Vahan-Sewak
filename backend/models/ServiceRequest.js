const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic'
  },
  problemType: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  problemDescription: {
    type: String,
    required: true,
    trim: true
  },
  photos: [{
    type: String
  }],
  video: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String
    }
  },
  vehicle: {
    make: String,
    model: String,
    year: String,
    registrationNumber: String,
    color: String
  },
  inspectionFee: {
    type: Number,
    default: 99
  },
  serviceCharge: {
    type: Number
  },
  totalAmount: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  assignedAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  estimatedArrivalTime: {
    type: Date
  },
  actualArrivalTime: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'mechanic', 'system']
  },
  rating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date
    }
  },
  notes: {
    userNotes: String,
    mechanicNotes: String
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
serviceRequestSchema.index({ 'location.coordinates': '2dsphere' });

// Index for status queries
serviceRequestSchema.index({ status: 1, createdAt: -1 });

// Index for user queries
serviceRequestSchema.index({ userId: 1, createdAt: -1 });

// Index for mechanic queries
serviceRequestSchema.index({ mechanicId: 1, createdAt: -1 });

// Method to calculate total amount
serviceRequestSchema.methods.calculateTotalAmount = function() {
  return (this.inspectionFee || 0) + (this.serviceCharge || 0);
};

// Method to update status
serviceRequestSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  
  switch (newStatus) {
    case 'assigned':
      this.assignedAt = new Date();
      break;
    case 'in_progress':
      this.startedAt = new Date();
      break;
    case 'completed':
      this.completedAt = new Date();
      break;
  }
  
  if (notes) {
    if (newStatus === 'in_progress' || newStatus === 'completed') {
      this.notes.mechanicNotes = notes;
    } else {
      this.notes.userNotes = notes;
    }
  }
  
  return this.save();
};

// Method to assign mechanic
serviceRequestSchema.methods.assignMechanic = function(mechanicId) {
  this.mechanicId = mechanicId;
  this.status = 'assigned';
  this.assignedAt = new Date();
  return this.save();
};

// Method to add rating
serviceRequestSchema.methods.addRating = function(rating, comment) {
  this.rating = {
    rating,
    comment,
    createdAt: new Date()
  };
  return this.save();
};

// Method to cancel request
serviceRequestSchema.methods.cancelRequest = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  return this.save();
};

// Static method to find nearby requests
serviceRequestSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    status: { $in: ['pending', 'assigned'] }
  }).populate('userId', 'name phone');
};

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
