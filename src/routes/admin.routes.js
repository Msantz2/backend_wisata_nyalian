const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireSuperadmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createAdminSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().min(6).required(),
  nama_lengkap: Joi.string().max(100).required(),
  role: Joi.string().valid('admin', 'superadmin').required()
});

const updateAdminSchema = Joi.object({
  username: Joi.string().max(50).optional(),
  password: Joi.string().min(6).optional(),
  nama_lengkap: Joi.string().max(100).optional(),
  role: Joi.string().valid('admin', 'superadmin').optional()
});

router.get('/', verifyToken, requireSuperadmin, adminController.getAllAdmin);
router.get('/:id', verifyToken, requireSuperadmin, adminController.getAdminById);
router.post('/', verifyToken, requireSuperadmin, validate(createAdminSchema), adminController.createAdmin);
router.put('/:id', verifyToken, requireSuperadmin, validate(updateAdminSchema), adminController.updateAdmin);
router.delete('/:id', verifyToken, requireSuperadmin, adminController.deleteAdmin);

module.exports = router;
