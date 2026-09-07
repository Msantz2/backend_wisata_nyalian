const express = require('express');
const router = express.Router();
const wisatawanController = require('../controllers/wisatawan.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createWisatawanSchema = Joi.object({
  nama_lengkap: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  no_whatsapp: Joi.string().max(20).required()
});

const updateWisatawanSchema = Joi.object({
  nama_lengkap: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  no_whatsapp: Joi.string().max(20).optional()
});

router.get('/', verifyToken, requireAdmin, wisatawanController.getAllWisatawan);
router.get('/:id', verifyToken, requireAdmin, wisatawanController.getWisatawanById);
router.get('/:id/reservasi', verifyToken, requireAdmin, wisatawanController.getWisatawanReservasi);
router.post('/', validate(createWisatawanSchema), wisatawanController.createWisatawan);
router.put('/:id', validate(updateWisatawanSchema), wisatawanController.updateWisatawan);
router.delete('/:id', verifyToken, requireAdmin, wisatawanController.deleteWisatawan);

module.exports = router;
