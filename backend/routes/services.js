const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  getTechnicianServices,
  getUserServices,
  getServiceStats
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

// Technician routes
router.get('/technician/my-services', authorize('technician'), getTechnicianServices);

// User routes
router.get('/user/my-services', authorize('user'), getUserServices);

// Stats - accessible to all authenticated users
router.get('/stats', getServiceStats);

// General routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Status update - accessible to technicians and admins
router.put('/:id/status', authorize('technician', 'admin'), updateServiceStatus);

// Admin only routes
router.post('/', authorize('admin'), createService);
router.put('/:id', authorize('admin'), updateService);
router.delete('/:id', authorize('admin'), deleteService);

module.exports = router;
