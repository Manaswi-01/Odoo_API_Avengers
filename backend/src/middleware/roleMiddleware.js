// Role-based access control middleware

const requireManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'Manager') {
        return res.status(403).json({
            message: 'Access denied. Manager role required.',
            requiredRole: 'Manager',
            userRole: req.user.role
        });
    }

    next();
};

const requireStaffOrManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'Manager' && req.user.role !== 'Staff') {
        return res.status(403).json({
            message: 'Access denied. Staff or Manager role required.',
            userRole: req.user.role
        });
    }

    next();
};

const checkActiveUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.isActive) {
        return res.status(403).json({
            message: 'Account is deactivated. Please contact administrator.'
        });
    }

    next();
};

module.exports = {
    requireManager,
    requireStaffOrManager,
    checkActiveUser
};
