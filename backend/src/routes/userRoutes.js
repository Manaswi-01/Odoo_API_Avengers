const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireManager } = require('../middleware/roleMiddleware');
const {
    getAllUsers,
    updateUserRole,
    updateUserStatus
} = require('../controllers/userController');

// All routes require authentication and Manager role
router.use(protect);
router.use(requireManager);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
