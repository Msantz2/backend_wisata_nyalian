const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token tidak ditemukan');
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Token tidak valid');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token sudah kadaluarsa');
    }
    return errorResponse(res, 500, 'Terjadi kesalahan saat memverifikasi token');
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini');
    }

    next();
  };
};

const requireAdmin = (req, res, next) => {
  return requireRole('admin', 'Superadmin')(req, res, next);
};

const requireSuperadmin = (req, res, next) => {
  return requireRole('Superadmin')(req, res, next);
};

const requireOwner = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id_admin;
      const userRole = req.user.role;

      if (!resourceId) {
        return errorResponse(res, 400, 'Resource ID tidak ditemukan');
      }

      if (userRole === 'admin' || userRole === 'Superadmin') {
        return next();
      }

      const resource = await Model.findByPk(resourceId);
      
      if (!resource) {
        return errorResponse(res, 404, 'Resource tidak ditemukan');
      }

      if (resource.created_by !== userId) {
        return errorResponse(res, 403, 'Anda tidak memiliki akses ke resource ini');
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return errorResponse(res, 500, 'Error checking ownership');
    }
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireSuperadmin,
  requireOwner
};
