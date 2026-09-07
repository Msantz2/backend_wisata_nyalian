const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required()
});

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', verifyToken, requireAdmin, authController.logout);
router.get('/me', verifyToken, requireAdmin, authController.getProfile);
router.post('/change-password', verifyToken, requireAdmin, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
