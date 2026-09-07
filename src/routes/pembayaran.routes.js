const express = require('express');
const router = express.Router();
const pembayaranController = require('../controllers/pembayaran.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createPembayaranSchema = Joi.object({
  id_reservasi: Joi.number().integer().required(),
  metode_bayar: Joi.string().max(50).required(),
  bukti_transfer: Joi.string().max(255).allow('', null).optional()
});

const updatePembayaranSchema = Joi.object({
  id_reservasi: Joi.number().integer().optional(),
  metode_bayar: Joi.string().max(50).optional(),
  bukti_transfer: Joi.string().max(255).allow('', null).optional()
});

router.get('/', verifyToken, requireAdmin, pembayaranController.getAllPembayaran);
router.get('/:id', verifyToken, requireAdmin, pembayaranController.getPembayaranById);
router.get('/reservasi/:id_reservasi', verifyToken, requireAdmin, pembayaranController.getPembayaranByReservasi);
router.post('/', validate(createPembayaranSchema), pembayaranController.createPembayaran);
router.put('/:id', verifyToken, requireAdmin, validate(updatePembayaranSchema), pembayaranController.updatePembayaran);
router.delete('/:id', verifyToken, requireAdmin, pembayaranController.deletePembayaran);

module.exports = router;
