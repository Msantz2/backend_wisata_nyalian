/**
 * FAQ Routes
 * Endpoint definitions untuk modul faq
 */

const express = require('express');
const router = express.Router();
const FAQController = require('../controllers/faq.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * GET /api/v1/faq
 * Get all FAQ (PUBLIC)
 */
router.get('/', FAQController.getAllFAQ);

/**
 * GET /api/v1/faq/:id
 * Get FAQ by ID (PUBLIC)
 */
router.get('/:id', FAQController.getFAQById);

/**
 * POST /api/v1/faq
 * Create FAQ (ADMIN ONLY)
 */
router.post('/', verifyToken, requireAdmin, FAQController.createFAQ);

/**
 * PUT /api/v1/faq/:id
 * Update FAQ (ADMIN ONLY)
 */
router.put('/:id', verifyToken, requireAdmin, FAQController.updateFAQ);

/**
 * DELETE /api/v1/faq/:id
 * Soft delete FAQ (ADMIN ONLY)
 */
router.delete('/:id', verifyToken, requireAdmin, FAQController.deleteFAQ);

module.exports = router;
