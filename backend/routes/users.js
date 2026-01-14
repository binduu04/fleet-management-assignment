const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/role/:role')
  .get(getUsersByRole);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
