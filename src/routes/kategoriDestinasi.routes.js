const express = require('express');
const router = express.Router();
const kategoriDestinasiController = require('../controllers/kategoriDestinasi.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const Joi = require('joi');

const createKategoriSchema = Joi.object({
  nama_kategori: Joi.string().max(50).required(),
  deskripsi_kategori: Joi.string().allow('', null).optional()
});

const updateKategoriSchema = Joi.object({
  nama_kategori: Joi.string().max(50).optional(),
  deskripsi_kategori: Joi.string().allow('', null).optional()
});

router.get('/', kategoriDestinasiController.getAllKategori);
router.get('/:id', kategoriDestinasiController.getKategoriById);
router.post('/', verifyToken, requireAdmin, validate(createKategoriSchema), kategoriDestinasiController.createKategori);
router.put('/:id', verifyToken, requireAdmin, validate(updateKategoriSchema), kategoriDestinasiController.updateKategori);
router.delete('/:id', verifyToken, requireAdmin, kategoriDestinasiController.deleteKategori);

module.exports = router;
