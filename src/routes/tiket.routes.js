const express = require('express');
const router = express.Router();
const tiketController = require('../controllers/tiket.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createTiketSchema = Joi.object({
  id_reservasi: Joi.number().integer().required()
});

router.get('/', verifyToken, requireAdmin, tiketController.getAllTiket);
router.get('/reservasi/:id_reservasi', tiketController.getTiketByReservasi);
router.get('/:id', verifyToken, requireAdmin, tiketController.getTiketById);
router.post('/', verifyToken, requireAdmin, validate(createTiketSchema), tiketController.createTiket);
router.patch('/:id/scan', verifyToken, requireAdmin, tiketController.scanTiket);
router.delete('/:id', verifyToken, requireAdmin, tiketController.deleteTiket);

module.exports = router;
