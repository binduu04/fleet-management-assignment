const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Private
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('vehicle', 'vehicleNumber make model')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('vehicle')
      .populate('assignedTechnician', 'name email phone')
      .populate('createdBy', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    // Add the logged-in user as the creator
    req.body.createdBy = req.user._id;

    const service = await Service.create(req.body);

    const populatedService = await Service.findById(service._id)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedService
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('vehicle', 'vehicleNumber make model')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service status
// @route   PUT /api/services/:id/status
// @access  Private/Technician
exports.updateServiceStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if the technician is assigned to this service
    if (req.user.role === 'technician' && service.assignedTechnician.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    service.status = status;
    if (notes) {
      service.notes = notes;
    }

    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicle', 'vehicleNumber make model')
      .populate('assignedTechnician', 'name email');

    res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get services assigned to technician
// @route   GET /api/services/technician/my-services
// @access  Private/Technician
exports.getTechnicianServices = async (req, res) => {
  try {
    const services = await Service.find({ assignedTechnician: req.user._id })
      .populate('vehicle', 'vehicleNumber make model')
      .sort('-scheduledDate');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get services for user's vehicles
// @route   GET /api/services/user/my-services
// @access  Private/User
exports.getUserServices = async (req, res) => {
  try {
    const Vehicle = require('../models/Vehicle');
    
    // Get all vehicles assigned to the user
    const userVehicles = await Vehicle.find({ assignedTo: req.user._id });
    const vehicleIds = userVehicles.map(v => v._id);

    // Get all services for those vehicles
    const services = await Service.find({ vehicle: { $in: vehicleIds } })
      .populate('vehicle', 'vehicleNumber make model')
      .populate('assignedTechnician', 'name email')
      .sort('-scheduledDate');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get service statistics
// @route   GET /api/services/stats
// @access  Private
exports.getServiceStats = async (req, res) => {
  try {
    const stats = await Service.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const serviceTypeStats = await Service.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        serviceTypeStats: serviceTypeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
