const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  assignVehicle,
  getUserVehicles,
  getMyVehicles
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

// User can view their own vehicles
router.get('/my/vehicles', getMyVehicles);

// Get all vehicles - accessible to all authenticated users
router.get('/', getAllVehicles);
router.get('/:id', getVehicle);
router.get('/user/:userId', getUserVehicles);

// Admin only routes
router.post('/', authorize('admin'), createVehicle);
router.put('/:id', authorize('admin'), updateVehicle);
router.delete('/:id', authorize('admin'), deleteVehicle);
router.put('/:id/assign', authorize('admin'), assignVehicle);

module.exports = router;
