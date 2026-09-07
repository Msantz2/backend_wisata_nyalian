const express = require('express');
const router = express.Router();
const ulasanWisatawanController = require('../controllers/ulasanWisatawan.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createUlasanSchema = Joi.object({
  id_reservasi: Joi.number().integer().required(),
  rating_bintang: Joi.number().integer().min(1).max(5).required(),
  komentar: Joi.string().allow('', null).optional()
});

const updateUlasanSchema = Joi.object({
  rating_bintang: Joi.number().integer().min(1).max(5).optional(),
  komentar: Joi.string().allow('', null).optional()
});

router.get('/', ulasanWisatawanController.getAllUlasan);
router.get('/reservasi/:id_reservasi', ulasanWisatawanController.getUlasanByReservasi);
router.get('/:id', ulasanWisatawanController.getUlasanById);
router.post('/', validate(createUlasanSchema), ulasanWisatawanController.createUlasan);
router.put('/:id', validate(updateUlasanSchema), ulasanWisatawanController.updateUlasan);
router.delete('/:id', verifyToken, requireAdmin, ulasanWisatawanController.deleteUlasan);

module.exports = router;
