const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  type: {
    type: String,
    enum: ['car', 'truck', 'van', 'bus', 'motorcycle', 'other'],
    default: 'car'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  mileage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
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
vehicleSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
