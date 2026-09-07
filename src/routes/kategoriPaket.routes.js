/**
 * Kategori Paket Routes
 * Endpoint definitions untuk modul kategori_paket
 */

const express = require('express');
const router = express.Router();
const KategoriPaketController = require('../controllers/kategoriPaket.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * GET /api/v1/kategori-paket
 * Get all kategori paket (PUBLIC)
 */
router.get('/', KategoriPaketController.getAllKategoriPaket);

/**
 * GET /api/v1/kategori-paket/:id
 * Get kategori paket by ID (PUBLIC)
 */
router.get('/:id', KategoriPaketController.getKategoriPaketById);

/**
 * POST /api/v1/kategori-paket
 * Create kategori paket (ADMIN ONLY)
 */
router.post('/', verifyToken, requireAdmin, KategoriPaketController.createKategoriPaket);

/**
 * PUT /api/v1/kategori-paket/:id
 * Update kategori paket (ADMIN ONLY)
 */
router.put('/:id', verifyToken, requireAdmin, KategoriPaketController.updateKategoriPaket);

/**
 * DELETE /api/v1/kategori-paket/:id
 * Soft delete kategori paket (ADMIN ONLY)
 */
router.delete('/:id', verifyToken, requireAdmin, KategoriPaketController.deleteKategoriPaket);

module.exports = router;
