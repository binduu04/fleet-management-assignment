const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['oil-change', 'tire-rotation', 'brake-service', 'engine-repair', 'inspection', 'battery-replacement', 'transmission-service', 'other'],
    default: 'inspection'
  },
  description: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  completedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
serviceSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Automatically set completedDate when status changes to completed
serviceSchema.pre('save', function() {
  if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
    this.completedDate = Date.now();
  }
});

module.exports = mongoose.model('Service', serviceSchema);
