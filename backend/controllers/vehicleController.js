const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedTo', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign vehicle to user
// @route   PUT /api/vehicles/:id/assign
// @access  Private/Admin
exports.assignVehicle = async (req, res) => {
  try {
    const { userId } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    vehicle.assignedTo = userId;
    await vehicle.save();

    const updatedVehicle = await Vehicle.findById(req.params.id).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: updatedVehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicles assigned to a user
// @route   GET /api/vehicles/user/:userId
// @access  Private
exports.getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ assignedTo: req.params.userId });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicles assigned to logged in user
// @route   GET /api/vehicles/my/vehicles
// @access  Private/User
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ assignedTo: req.user._id });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
