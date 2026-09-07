/**
 * Kategori Paket Controller
 * Handle request/response untuk endpoints kategori_paket
 */

const KategoriPaketService = require('../services/kategoriPaket.service');
const { successResponse, errorResponse } = require('../utils/response');

class KategoriPaketController {
  /**
   * GET /api/v1/kategori-paket
   * Get all kategori paket dengan pagination
   */
  static async getAllKategoriPaket(req, res) {
    try {
      const { page, limit, search, sort, order } = req.query;

      const filters = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        sort: sort || 'id_kategori',
        order: order || 'ASC'
      };

      const result = await KategoriPaketService.getAllKategoriPaket(filters);

      return successResponse(
        res,
        200,
        'Daftar kategori paket berhasil diambil',
        result.data,
        result.meta
      );
    } catch (error) {
      console.error('Error in getAllKategoriPaket:', error);
      return errorResponse(res, 500, 'Gagal mengambil data kategori paket', [error.message]);
    }
  }

  /**
   * GET /api/v1/kategori-paket/:id
   * Get kategori paket by ID
   */
  static async getKategoriPaketById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID kategori paket tidak valid');
      }

      const kategoriPaket = await KategoriPaketService.getKategoriPaketById(parseInt(id));

      return successResponse(
        res,
        200,
        'Detail kategori paket berhasil diambil',
        kategoriPaket
      );
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      console.error('Error in getKategoriPaketById:', error);
      return errorResponse(res, 500, 'Gagal mengambil data kategori paket', [error.message]);
    }
  }

  /**
   * POST /api/v1/kategori-paket
   * Create kategori paket baru (Admin only)
   */
  static async createKategoriPaket(req, res) {
    try {
      const { nama_kategori, slug, deskripsi_kategori } = req.body;

      // Validation
      if (!nama_kategori || !nama_kategori.trim()) {
        return errorResponse(res, 400, 'Validasi gagal', ['nama_kategori wajib diisi']);
      }

      if (!slug || !slug.trim()) {
        return errorResponse(res, 400, 'Validasi gagal', ['slug wajib diisi']);
      }

      const data = {
        nama_kategori,
        slug,
        deskripsi_kategori
      };

      const newKategoriPaket = await KategoriPaketService.createKategoriPaket(data);

      return successResponse(
        res,
        201,
        'Kategori paket berhasil dibuat',
        newKategoriPaket
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 409) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in createKategoriPaket:', error);
      return errorResponse(res, 500, 'Gagal membuat kategori paket', [error.message]);
    }
  }

  /**
   * PUT /api/v1/kategori-paket/:id
   * Update kategori paket (Admin only)
   */
  static async updateKategoriPaket(req, res) {
    try {
      const { id } = req.params;
      const { nama_kategori, slug, deskripsi_kategori, is_active } = req.body;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID kategori paket tidak valid');
      }

      const data = {};
      if (nama_kategori !== undefined) data.nama_kategori = nama_kategori;
      if (slug !== undefined) data.slug = slug;
      if (deskripsi_kategori !== undefined) data.deskripsi_kategori = deskripsi_kategori;
      if (is_active !== undefined) data.is_active = is_active;

      const updatedKategoriPaket = await KategoriPaketService.updateKategoriPaket(
        parseInt(id),
        data
      );

      return successResponse(
        res,
        200,
        'Kategori paket berhasil diupdate',
        updatedKategoriPaket
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404 || error.statusCode === 409) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in updateKategoriPaket:', error);
      return errorResponse(res, 500, 'Gagal mengupdate kategori paket', [error.message]);
    }
  }

  /**
   * DELETE /api/v1/kategori-paket/:id
   * Soft delete kategori paket (Admin only)
   */
  static async deleteKategoriPaket(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID kategori paket tidak valid');
      }

      const deletedKategoriPaket = await KategoriPaketService.deleteKategoriPaket(parseInt(id));

      return successResponse(
        res,
        200,
        'Kategori paket berhasil dihapus',
        deletedKategoriPaket
      );
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      console.error('Error in deleteKategoriPaket:', error);
      return errorResponse(res, 500, 'Gagal menghapus kategori paket', [error.message]);
    }
  }
}

module.exports = KategoriPaketController;
