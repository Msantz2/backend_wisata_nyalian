/**
 * FAQ Controller
 * Handle request/response untuk endpoints faq
 */

const FAQService = require('../services/faq.service');
const { successResponse, errorResponse } = require('../utils/response');

class FAQController {
  /**
   * GET /api/v1/faq
   * Get all FAQ dengan pagination
   */
  static async getAllFAQ(req, res) {
    try {
      const { page, limit, search, featured, is_active, sort, order } = req.query;

      const filters = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        featured: featured !== undefined ? featured === 'true' : null,
        is_active: is_active !== undefined ? is_active !== 'false' : true,
        sort: sort || 'urutan',
        order: order || 'ASC'
      };

      const result = await FAQService.getAllFAQ(filters);

      return successResponse(
        res,
        200,
        'Daftar FAQ berhasil diambil',
        result.data,
        result.meta
      );
    } catch (error) {
      console.error('Error in getAllFAQ:', error);
      return errorResponse(res, 500, 'Gagal mengambil data FAQ', [error.message]);
    }
  }

  /**
   * GET /api/v1/faq/:id
   * Get FAQ by ID
   */
  static async getFAQById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID FAQ tidak valid');
      }

      const faq = await FAQService.getFAQById(parseInt(id));

      return successResponse(
        res,
        200,
        'Detail FAQ berhasil diambil',
        faq
      );
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      console.error('Error in getFAQById:', error);
      return errorResponse(res, 500, 'Gagal mengambil data FAQ', [error.message]);
    }
  }

  /**
   * POST /api/v1/faq
   * Create FAQ baru (Admin only)
   */
  static async createFAQ(req, res) {
    try {
      const { pertanyaan, jawaban, kategori, urutan, featured } = req.body;

      // Validation
      if (!pertanyaan || !pertanyaan.trim()) {
        return errorResponse(res, 400, 'Validasi gagal', ['pertanyaan wajib diisi']);
      }

      if (!jawaban || !jawaban.trim()) {
        return errorResponse(res, 400, 'Validasi gagal', ['jawaban wajib diisi']);
      }

      const data = {
        pertanyaan,
        jawaban,
        kategori,
        urutan,
        featured
      };

      const newFAQ = await FAQService.createFAQ(data);

      return successResponse(
        res,
        201,
        'FAQ berhasil dibuat',
        newFAQ
      );
    } catch (error) {
      if (error.statusCode === 400) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in createFAQ:', error);
      return errorResponse(res, 500, 'Gagal membuat FAQ', [error.message]);
    }
  }

  /**
   * PUT /api/v1/faq/:id
   * Update FAQ (Admin only)
   */
  static async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { pertanyaan, jawaban, kategori, urutan, featured, is_active } = req.body;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID FAQ tidak valid');
      }

      const data = {};
      if (pertanyaan !== undefined) data.pertanyaan = pertanyaan;
      if (jawaban !== undefined) data.jawaban = jawaban;
      if (kategori !== undefined) data.kategori = kategori;
      if (urutan !== undefined) data.urutan = urutan;
      if (featured !== undefined) data.featured = featured;
      if (is_active !== undefined) data.is_active = is_active;

      const updatedFAQ = await FAQService.updateFAQ(parseInt(id), data);

      return successResponse(
        res,
        200,
        'FAQ berhasil diupdate',
        updatedFAQ
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in updateFAQ:', error);
      return errorResponse(res, 500, 'Gagal mengupdate FAQ', [error.message]);
    }
  }

  /**
   * DELETE /api/v1/faq/:id
   * Soft delete FAQ (Admin only)
   */
  static async deleteFAQ(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID FAQ tidak valid');
      }

      const deletedFAQ = await FAQService.deleteFAQ(parseInt(id));

      return successResponse(
        res,
        200,
        'FAQ berhasil dihapus',
        deletedFAQ
      );
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      console.error('Error in deleteFAQ:', error);
      return errorResponse(res, 500, 'Gagal menghapus FAQ', [error.message]);
    }
  }
}

module.exports = FAQController;
