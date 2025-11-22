const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Manager only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash -otp');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Manager only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['Manager', 'Staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be Manager or Staff.' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Deactivate/Activate user
// @route   PUT /api/users/:id/status
// @access  Private (Manager only)
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be a boolean value' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deactivating yourself
        if (user._id.toString() === req.user._id.toString() && !isActive) {
            return res.status(400).json({ message: 'You cannot deactivate your own account' });
        }

        user.isActive = isActive;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    updateUserStatus
};
