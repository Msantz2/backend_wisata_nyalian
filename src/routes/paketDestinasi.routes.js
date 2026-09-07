/**
 * Paket Destinasi Routes
 * Endpoint definitions untuk modul paket_destinasi (M:M Junction)
 */

const express = require('express');
const router = express.Router();
const PaketDestinationController = require('../controllers/paketDestinasi.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * GET /api/v1/paket-destinasi
 * Get all paket-destinasi links (ADMIN)
 */
router.get('/', verifyToken, requireAdmin, PaketDestinationController.getAllPaketDestinasi);

/**
 * GET /api/v1/paket-destinasi/paket/:idPaket
 * Get paket with all destinasi sorted by urutan (PUBLIC)
 */
router.get('/paket/:idPaket', PaketDestinationController.getPaketWithDestinasi);

/**
 * POST /api/v1/paket-destinasi
 * Create paket-destinasi link (ADMIN ONLY)
 */
router.post('/', verifyToken, requireAdmin, PaketDestinationController.createPaketDestinasi);

/**
 * POST /api/v1/paket-destinasi/bulk
 * Create multiple paket-destinasi links (ADMIN ONLY)
 */
router.post('/bulk', verifyToken, requireAdmin, PaketDestinationController.createMultiplePaketDestinasi);

/**
 * PUT /api/v1/paket-destinasi/:id
 * Update paket-destinasi urutan (ADMIN ONLY)
 */
router.put('/:id', verifyToken, requireAdmin, PaketDestinationController.updatePaketDestinasi);

/**
 * DELETE /api/v1/paket-destinasi/:id
 * Delete paket-destinasi link (ADMIN ONLY)
 */
router.delete('/:id', verifyToken, requireAdmin, PaketDestinationController.deletePaketDestinasi);

module.exports = router;
