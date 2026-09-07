const express = require('express');
const router = express.Router();
const reservasiController = require('../controllers/reservasi.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createReservasiSchema = Joi.object({
  id_wisatawan: Joi.number().integer().required(),
  id_paket: Joi.number().integer().required(),
  id_admin: Joi.number().integer().allow(null).optional(),
  tanggal_kunjungan: Joi.date().iso().required(),
  jumlah_pax: Joi.number().integer().min(1).required(),
  tipe_reservasi: Joi.string().valid('online', 'walk-in').optional()
});

const updateReservasiSchema = Joi.object({
  id_wisatawan: Joi.number().integer().optional(),
  id_paket: Joi.number().integer().optional(),
  id_admin: Joi.number().integer().allow(null).optional(),
  tanggal_kunjungan: Joi.date().iso().optional(),
  jumlah_pax: Joi.number().integer().min(1).optional(),
  tipe_reservasi: Joi.string().valid('online', 'walk-in').optional(),
  status_reservasi: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional()
});

const updateStatusSchema = Joi.object({
  status_reservasi: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').required()
});

router.get('/', verifyToken, requireAdmin, reservasiController.getAllReservasi);
router.get('/kode/:kode_booking', reservasiController.getReservasiByKodeBooking);
router.get('/:id', verifyToken, requireAdmin, reservasiController.getReservasiById);
router.post('/', validate(createReservasiSchema), reservasiController.createReservasi);
router.put('/:id', verifyToken, requireAdmin, validate(updateReservasiSchema), reservasiController.updateReservasi);
router.patch('/:id/status', verifyToken, requireAdmin, validate(updateStatusSchema), reservasiController.updateReservasiStatus);
router.delete('/:id', verifyToken, requireAdmin, reservasiController.deleteReservasi);

module.exports = router;
