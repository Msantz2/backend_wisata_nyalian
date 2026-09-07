const express = require('express');
const router = express.Router();
const ketersediaanKuotaController = require('../controllers/ketersediaanKuota.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createKuotaSchema = Joi.object({
  id_paket: Joi.number().integer().required(),
  tanggal: Joi.date().iso().required(),
  sisa_kuota: Joi.number().integer().min(0).required()
});

const updateKuotaSchema = Joi.object({
  id_paket: Joi.number().integer().optional(),
  tanggal: Joi.date().iso().optional(),
  sisa_kuota: Joi.number().integer().min(0).optional()
});

router.get('/', ketersediaanKuotaController.getAllKuota);
router.get('/:id', ketersediaanKuotaController.getKuotaById);
router.post('/', verifyToken, requireAdmin, validate(createKuotaSchema), ketersediaanKuotaController.createKuota);
router.put('/:id', verifyToken, requireAdmin, validate(updateKuotaSchema), ketersediaanKuotaController.updateKuota);
router.delete('/:id', verifyToken, requireAdmin, ketersediaanKuotaController.deleteKuota);

module.exports = router;
