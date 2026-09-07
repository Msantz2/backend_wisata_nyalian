const express = require('express');
const router = express.Router();
const destinasiController = require('../controllers/destinasi.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload, handleMulterError } = require('../middlewares/multerSetup');
const Joi = require('joi');

const createDestinasiSchema = Joi.object({
  id_kategori: Joi.number().integer().required(),
  nama_destinasi: Joi.string().max(100).required(),
  slug: Joi.string().max(255).allow('', null).optional(),
  deskripsi: Joi.string().allow('', null).optional(),
  deskripsi_pendek: Joi.string().allow('', null).optional(),
  alamat: Joi.string().allow('', null).optional(),
  lokasi_maps: Joi.string().max(255).allow('', null).optional(),
  jam_operasional: Joi.string().max(255).allow('', null).optional(),
  jam_buka: Joi.string().allow('', null).optional(),
  jam_tutup: Joi.string().allow('', null).optional(),
  fasilitas: Joi.string().allow('', null).optional(),
  latitude: Joi.number().allow(null).optional(),
  longitude: Joi.number().allow(null).optional(),
  harga_tiket: Joi.string().allow('', null).optional(),
  harga_tiket_dewasa: Joi.number().allow(null).optional(),
  harga_tiket_anak: Joi.number().allow(null).optional(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  desa: Joi.string().allow('', null).optional(),
  provinsi: Joi.string().allow('', null).optional(),
  kabupaten: Joi.string().allow('', null).optional(),
  kecamatan: Joi.string().allow('', null).optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
}).unknown(true);

const updateDestinasiSchema = Joi.object({
  id_kategori: Joi.number().integer().optional(),
  nama_destinasi: Joi.string().max(100).optional(),
  slug: Joi.string().max(255).allow('', null).optional(),
  deskripsi: Joi.string().allow('', null).optional(),
  deskripsi_pendek: Joi.string().allow('', null).optional(),
  alamat: Joi.string().allow('', null).optional(),
  lokasi_maps: Joi.string().max(255).allow('', null).optional(),
  jam_operasional: Joi.string().max(255).allow('', null).optional(),
  jam_buka: Joi.string().allow('', null).optional(),
  jam_tutup: Joi.string().allow('', null).optional(),
  fasilitas: Joi.string().allow('', null).optional(),
  latitude: Joi.number().allow(null).optional(),
  longitude: Joi.number().allow(null).optional(),
  harga_tiket: Joi.string().allow('', null).optional(),
  harga_tiket_dewasa: Joi.number().allow(null).optional(),
  harga_tiket_anak: Joi.number().allow(null).optional(),
  featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  desa: Joi.string().allow('', null).optional(),
  provinsi: Joi.string().allow('', null).optional(),
  kabupaten: Joi.string().allow('', null).optional(),
  kecamatan: Joi.string().allow('', null).optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
}).unknown(true);

router.get('/', destinasiController.getAllDestinasi);
router.get('/slug/:slug', destinasiController.getDestinasiBySlug);
router.get('/:id', destinasiController.getDestinasiById);
router.get('/:id/galeri', destinasiController.getDestinasiGaleri);
router.post('/', verifyToken, requireAdmin, upload.single('gambar'), handleMulterError, validate(createDestinasiSchema), destinasiController.createDestinasi);
router.put('/:id', verifyToken, requireAdmin, upload.single('gambar'), handleMulterError, validate(updateDestinasiSchema), destinasiController.updateDestinasi);
router.delete('/:id', verifyToken, requireAdmin, destinasiController.deleteDestinasi);

module.exports = router;
