const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String
  },
  specialization: {
    type: String,
    required: true,
    enum: ['Engine Expert', 'All Repairs', 'Electrical & AC', 'Tyre Specialist', 'General']
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  serviceArea: {
    radius: {
      type: Number,
      default: 10 // km
    }
  },
  serviceCharge: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  documents: {
    aadharCard: String,
    panCard: String,
    drivingLicense: String,
    vehicleRC: String,
    insurance: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    thisWeek: {
      type: Number,
      default: 0
    }
  },
  completedServices: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number, // in minutes
    default: 15
  }
}, {
  timestamps: true
});

// Index for geospatial queries
mechanicSchema.index({ location: '2dsphere' });

// Method to calculate average rating
mechanicSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / this.reviews.length;
};

// Method to get public profile
mechanicSchema.methods.getPublicProfile = function() {
  const mechanicObject = this.toObject();
  delete mechanicObject.password;
  delete mechanicObject.documents;
  delete mechanicObject.bankDetails;
  delete mechanicObject.__v;
  return mechanicObject;
};

// Method to update location
mechanicSchema.methods.updateLocation = function(latitude, longitude) {
  this.currentLocation.coordinates.latitude = latitude;
  this.currentLocation.coordinates.longitude = longitude;
  this.currentLocation.lastUpdated = new Date();
  return this.save();
};

// Method to check if mechanic is in service area
mechanicSchema.methods.isInServiceArea = function(userLatitude, userLongitude) {
  const R = 6371; // Earth's radius in km
  const lat1 = this.location.coordinates[1];
  const lon1 = this.location.coordinates[0];
  const lat2 = userLatitude;
  const lon2 = userLongitude;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance <= this.serviceArea.radius;
};

module.exports = mongoose.model('Mechanic', mechanicSchema);
