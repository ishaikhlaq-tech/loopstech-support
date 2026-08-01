// backend/src/middleware/rbac.js

/**
 * Express middleware to enforce role-based access control.
 * Usage: router.get('/admin-route', requireAuth, requireRole('admin'), handler)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: User identity not verified' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Requires one of these roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};
