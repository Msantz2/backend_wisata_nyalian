const express = require('express');
const router = express.Router();
const paketWisataController = require('../controllers/paketWisata.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload, handleMulterError } = require('../middlewares/multerSetup');
const { parseFormDataArrays, parseFormDataNumbers, parseFormDataBooleans } = require('../middlewares/parseFormData.middleware');
const Joi = require('joi');

const createPaketSchema = Joi.object({
  nama_paket: Joi.string().max(100).required(),
  deskripsi_paket: Joi.string().allow('', null).optional(),
  deskripsi_pendek: Joi.string().allow('', null).optional(),
  harga_per_pax: Joi.number().integer().min(0).required(),
  kuota_default: Joi.number().integer().min(0).required(),
  slug: Joi.string().max(255).allow('', null).optional(),
  durasi: Joi.string().max(100).allow('', null).optional(),
  durasi_hari: Joi.number().integer().min(0).allow(null).optional(),
  durasi_jam: Joi.number().integer().min(0).allow(null).optional(),
  kapasitas_min: Joi.number().integer().min(1).allow(null).optional(),
  kapasitas_max: Joi.number().integer().min(1).allow(null).optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  included: Joi.array().items(Joi.string()).optional(),
  excluded: Joi.array().items(Joi.string()).optional(),
  itinerary: Joi.alternatives().try(
    Joi.array(),
    Joi.string().allow('')
  ).optional(),
  id_kategori: Joi.number().integer().positive().required(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
});

const updatePaketSchema = Joi.object({
  nama_paket: Joi.string().max(100).optional(),
  deskripsi_paket: Joi.string().allow('', null).optional(),
  deskripsi_pendek: Joi.string().allow('', null).optional(),
  harga_per_pax: Joi.number().integer().min(0).optional(),
  kuota_default: Joi.number().integer().min(0).optional(),
  slug: Joi.string().max(255).allow('', null).optional(),
  durasi: Joi.string().max(100).allow('', null).optional(),
  durasi_hari: Joi.number().integer().min(0).allow(null).optional(),
  durasi_jam: Joi.number().integer().min(0).allow(null).optional(),
  kapasitas_min: Joi.number().integer().min(1).allow(null).optional(),
  kapasitas_max: Joi.number().integer().min(1).allow(null).optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  included: Joi.array().items(Joi.string()).optional(),
  excluded: Joi.array().items(Joi.string()).optional(),
  itinerary: Joi.alternatives().try(
    Joi.array(),
    Joi.string().allow('')
  ).optional(),
  id_kategori: Joi.number().integer().positive().optional(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
});

router.get('/', paketWisataController.getAllPaket);
router.get('/:id', paketWisataController.getPaketById);
router.get('/:id/galeri', paketWisataController.getPaketGaleri);
router.get('/:id/kuota', paketWisataController.getPaketKuota);
router.post('/', 
  verifyToken, 
  requireAdmin, 
  upload.single('gambar'), 
  handleMulterError,
  parseFormDataArrays(['highlights', 'included', 'excluded', 'itinerary']),
  parseFormDataNumbers(['harga_per_pax', 'kuota_default', 'durasi_hari', 'durasi_jam', 'kapasitas_min', 'kapasitas_max', 'id_kategori']),
  parseFormDataBooleans(['featured', 'is_active']),
  validate(createPaketSchema), 
  paketWisataController.createPaket
);
router.put('/:id', 
  verifyToken, 
  requireAdmin, 
  upload.single('gambar'), 
  handleMulterError,
  parseFormDataArrays(['highlights', 'included', 'excluded', 'itinerary']),
  parseFormDataNumbers(['harga_per_pax', 'kuota_default', 'durasi_hari', 'durasi_jam', 'kapasitas_min', 'kapasitas_max', 'id_kategori']),
  parseFormDataBooleans(['featured', 'is_active']),
  validate(updatePaketSchema), 
  paketWisataController.updatePaket
);
router.delete('/:id', verifyToken, requireAdmin, paketWisataController.deletePaket);

module.exports = router;
