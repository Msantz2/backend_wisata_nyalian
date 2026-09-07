const express = require('express');
const router = express.Router();
const beritaDesaController = require('../controllers/beritaDesa.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload, handleMulterError } = require('../middlewares/multerSetup');
const Joi = require('joi');

const createBeritaSchema = Joi.object({
  judul_berita: Joi.string().max(200).required(),
  isi_konten: Joi.string().required(),
  title: Joi.string().max(200).optional(),
  slug: Joi.string().max(255).allow('', null).optional(),
  category: Joi.string().max(100).allow('', null).optional(),
  excerpt: Joi.string().allow('', null).optional(),
  author: Joi.string().max(100).allow('', null).optional(),
  content: Joi.string().allow('', null).optional(),
  coverImage: Joi.string().max(255).allow('', null).optional(),
  coverImageAlt: Joi.string().max(255).allow('', null).optional(),
  status: Joi.string().valid('draft', 'published').optional(),
  seo: Joi.object().allow(null).optional(),
  tags: Joi.array().items(Joi.string()).allow(null).optional(),
  featured: Joi.boolean().optional(),
  readTime: Joi.string().allow('', null).optional(),
  url_thumbnail_cdn: Joi.string().max(255).allow('', null).optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
}).unknown(true);

const updateBeritaSchema = Joi.object({
  judul_berita: Joi.string().max(200).optional(),
  isi_konten: Joi.string().optional(),
  title: Joi.string().max(200).optional(),
  slug: Joi.string().max(255).allow('', null).optional(),
  category: Joi.string().max(100).allow('', null).optional(),
  excerpt: Joi.string().allow('', null).optional(),
  author: Joi.string().max(100).allow('', null).optional(),
  content: Joi.string().allow('', null).optional(),
  coverImage: Joi.string().max(255).allow('', null).optional(),
  coverImageAlt: Joi.string().max(255).allow('', null).optional(),
  status: Joi.string().valid('draft', 'published').optional(),
  seo: Joi.object().allow(null).optional(),
  tags: Joi.array().items(Joi.string()).allow(null).optional(),
  featured: Joi.boolean().optional(),
  readTime: Joi.string().allow('', null).optional(),
  url_thumbnail_cdn: Joi.string().max(255).allow('', null).optional(),
  url_gambar_cdn: Joi.string().max(255).allow('', null).optional(),
  gambar_public_id: Joi.string().max(255).allow('', null).optional(),
  gambar_metadata: Joi.object().allow(null).optional()
}).unknown(true);

router.get('/', beritaDesaController.getAllBerita);
router.get('/:id', beritaDesaController.getBeritaById);
router.post('/', verifyToken, requireAdmin, upload.single('gambar'), handleMulterError, validate(createBeritaSchema), beritaDesaController.createBerita);
router.put('/:id', verifyToken, requireAdmin, upload.single('gambar'), handleMulterError, validate(updateBeritaSchema), beritaDesaController.updateBerita);
router.delete('/:id', verifyToken, requireAdmin, beritaDesaController.deleteBerita);

module.exports = router;
