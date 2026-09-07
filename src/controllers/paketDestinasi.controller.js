/**
 * Paket Destinasi Controller
 * Handle request/response untuk endpoints paket_destinasi (M:M Junction)
 */

const PaketDestinationService = require('../services/paketDestinasi.service');
const { successResponse, errorResponse } = require('../utils/response');

class PaketDestinationController {
  /**
   * GET /api/v1/paket-destinasi
   * Get all paket-destinasi links dengan pagination
   */
  static async getAllPaketDestinasi(req, res) {
    try {
      const { page, limit, id_paket, id_destinasi } = req.query;

      const filters = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        id_paket: id_paket ? parseInt(id_paket) : null,
        id_destinasi: id_destinasi ? parseInt(id_destinasi) : null
      };

      const result = await PaketDestinationService.getAllPaketDestinasi(filters);

      return successResponse(
        res,
        200,
        'Daftar link paket-destinasi berhasil diambil',
        result.data,
        result.meta
      );
    } catch (error) {
      console.error('Error in getAllPaketDestinasi:', error);
      return errorResponse(res, 500, 'Gagal mengambil data paket-destinasi', [error.message]);
    }
  }

  /**
   * GET /api/v1/paket-destinasi/paket/:idPaket
   * Get paket with all destinasi (sorted by urutan)
   */
  static async getPaketWithDestinasi(req, res) {
    try {
      const { idPaket } = req.params;

      if (!idPaket || isNaN(idPaket)) {
        return errorResponse(res, 400, 'ID paket tidak valid');
      }

      const destinasi = await PaketDestinationService.getPaketWithDestinasi(parseInt(idPaket));

      if (destinasi.length === 0) {
        return successResponse(
          res,
          200,
          'Paket tidak memiliki destinasi',
          []
        );
      }

      return successResponse(
        res,
        200,
        'Destinasi paket berhasil diambil',
        destinasi
      );
    } catch (error) {
      console.error('Error in getPaketWithDestinasi:', error);
      return errorResponse(res, 500, 'Gagal mengambil destinasi paket', [error.message]);
    }
  }

  /**
   * POST /api/v1/paket-destinasi
   * Create paket-destinasi link (Admin only)
   */
  static async createPaketDestinasi(req, res) {
    try {
      const { id_paket, id_destinasi, urutan } = req.body;

      // Validation
      if (!id_paket || isNaN(id_paket)) {
        return errorResponse(res, 400, 'Validasi gagal', ['id_paket harus berupa angka']);
      }

      if (!id_destinasi || isNaN(id_destinasi)) {
        return errorResponse(res, 400, 'Validasi gagal', ['id_destinasi harus berupa angka']);
      }

      const data = {
        id_paket: parseInt(id_paket),
        id_destinasi: parseInt(id_destinasi),
        urutan: urutan !== undefined ? parseInt(urutan) : 0
      };

      const newLink = await PaketDestinationService.createPaketDestinasi(data);

      return successResponse(
        res,
        201,
        'Link paket-destinasi berhasil dibuat',
        newLink
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404 || error.statusCode === 409) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in createPaketDestinasi:', error);
      return errorResponse(res, 500, 'Gagal membuat link paket-destinasi', [error.message]);
    }
  }

  /**
   * PUT /api/v1/paket-destinasi/:id
   * Update paket-destinasi urutan (Admin only)
   */
  static async updatePaketDestinasi(req, res) {
    try {
      const { id } = req.params;
      const { urutan } = req.body;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID link paket-destinasi tidak valid');
      }

      if (urutan === undefined || urutan === null || isNaN(urutan)) {
        return errorResponse(res, 400, 'Validasi gagal', ['urutan harus berupa angka']);
      }

      const data = {
        urutan: parseInt(urutan)
      };

      const updatedLink = await PaketDestinationService.updatePaketDestinasi(
        parseInt(id),
        data
      );

      return successResponse(
        res,
        200,
        'Link paket-destinasi berhasil diupdate',
        updatedLink
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in updatePaketDestinasi:', error);
      return errorResponse(res, 500, 'Gagal mengupdate link paket-destinasi', [error.message]);
    }
  }

  /**
   * DELETE /api/v1/paket-destinasi/:id
   * Delete paket-destinasi link (Admin only)
   */
  static async deletePaketDestinasi(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 400, 'ID link paket-destinasi tidak valid');
      }

      const deletedLink = await PaketDestinationService.deletePaketDestinasi(parseInt(id));

      return successResponse(
        res,
        200,
        'Link paket-destinasi berhasil dihapus',
        deletedLink
      );
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      console.error('Error in deletePaketDestinasi:', error);
      return errorResponse(res, 500, 'Gagal menghapus link paket-destinasi', [error.message]);
    }
  }

  /**
   * POST /api/v1/paket-destinasi/bulk
   * Create multiple paket-destinasi links at once (Admin only)
   */
  static async createMultiplePaketDestinasi(req, res) {
    try {
      const { id_paket, destinasi_ids } = req.body;

      // Validation
      if (!id_paket || isNaN(id_paket)) {
        return errorResponse(res, 400, 'Validasi gagal', ['id_paket harus berupa angka']);
      }

      if (!Array.isArray(destinasi_ids) || destinasi_ids.length === 0) {
        return errorResponse(res, 400, 'Validasi gagal', ['destinasi_ids harus berupa array dan tidak kosong']);
      }

      const results = await PaketDestinationService.createMultiplePaketDestinasi(
        parseInt(id_paket),
        destinasi_ids.map(id => parseInt(id))
      );

      return successResponse(
        res,
        201,
        `${results.length} link paket-destinasi berhasil dibuat`,
        results
      );
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        return errorResponse(res, error.statusCode, error.message);
      }
      console.error('Error in createMultiplePaketDestinasi:', error);
      return errorResponse(res, 500, 'Gagal membuat multiple link paket-destinasi', [error.message]);
    }
  }
}

module.exports = PaketDestinationController;
