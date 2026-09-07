/**
 * Paket Destinasi Service
 * Business logic untuk modul paket_destinasi (M:M Junction)
 * Menggunakan raw SQL + pg library (NO ORM)
 */

const { pool } = require('../config/database');

class PaketDestinationService {
  /**
   * Get all paket-destinasi links dengan pagination
   * @param {Object} filters - { page, limit, id_paket, id_destinasi }
   * @returns {Object} - { data: [], meta: { page, limit, total } }
   */
  static async getAllPaketDestinasi(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        id_paket = null,
        id_destinasi = null
      } = filters;

      const offset = (page - 1) * limit;
      const whereConditions = [];
      const queryParams = [];
      let paramCount = 1;

      // Filter by id_paket
      if (id_paket !== null && id_paket !== undefined) {
        whereConditions.push(`pd.id_paket = $${paramCount}`);
        queryParams.push(parseInt(id_paket));
        paramCount++;
      }

      // Filter by id_destinasi
      if (id_destinasi !== null && id_destinasi !== undefined) {
        whereConditions.push(`pd.id_destinasi = $${paramCount}`);
        queryParams.push(parseInt(id_destinasi));
        paramCount++;
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM paket_destinasi pd
        ${whereClause}
      `;
      const countResult = await pool.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Get paginated data with join
      const dataQuery = `
        SELECT 
          pd.id_paket_destinasi,
          pd.id_paket,
          pd.id_destinasi,
          pd.urutan,
          pd.created_at,
          p.nama_paket,
          d.nama_destinasi
        FROM paket_destinasi pd
        LEFT JOIN paket_wisata p ON pd.id_paket = p.id_paket
        LEFT JOIN destinasi d ON pd.id_destinasi = d.id_destinasi
        ${whereClause}
        ORDER BY pd.id_paket, pd.urutan ASC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      queryParams.push(limit, offset);
      const result = await pool.query(dataQuery, queryParams);

      return {
        data: result.rows,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching paket-destinasi: ${error.message}`);
    }
  }

  /**
   * Get paket with all destinasi (sorted by urutan)
   * @param {number} idPaket - id_paket
   * @returns {Object} - paket with destinasi array
   */
  static async getPaketWithDestinasi(idPaket) {
    try {
      const query = `
        SELECT 
          pd.id_paket_destinasi,
          pd.id_paket,
          pd.id_destinasi,
          pd.urutan,
          pd.created_at,
          d.id_destinasi,
          d.nama_destinasi,
          d.slug,
          d.deskripsi_pendek,
          d.deskripsi,
          d.alamat,
          d.desa,
          d.provinsi,
          d.kabupaten,
          d.kecamatan,
          d.latitude,
          d.longitude,
          d.lokasi_maps,
          d.jam_buka,
          d.jam_tutup,
          d.jam_operasional,
          d.fasilitas,
          d.harga_tiket_dewasa,
          d.harga_tiket_anak,
          d.harga_tiket,
          d.featured,
          d.is_active,
          d.url_gambar_cdn,
          d.gambar_public_id,
          d.gambar_metadata,
          d.created_at as destinasi_created_at,
          d.updated_at as destinasi_updated_at
        FROM paket_destinasi pd
        LEFT JOIN destinasi d ON pd.id_destinasi = d.id_destinasi
        WHERE pd.id_paket = $1 AND d.deleted_at IS NULL
        ORDER BY pd.urutan ASC
      `;

      const result = await pool.query(query, [idPaket]);

      return result.rows.map(row => ({
        id_paket_destinasi: row.id_paket_destinasi,
        id_paket: row.id_paket,
        id_destinasi: row.id_destinasi,
        urutan: row.urutan,
        created_at: row.created_at,
        destinasi: {
          id_destinasi: row.id_destinasi,
          nama_destinasi: row.nama_destinasi,
          slug: row.slug,
          deskripsi_pendek: row.deskripsi_pendek,
          deskripsi: row.deskripsi,
          alamat: row.alamat,
          desa: row.desa,
          provinsi: row.provinsi,
          kabupaten: row.kabupaten,
          kecamatan: row.kecamatan,
          latitude: row.latitude,
          longitude: row.longitude,
          lokasi_maps: row.lokasi_maps,
          jam_buka: row.jam_buka,
          jam_tutup: row.jam_tutup,
          jam_operasional: row.jam_operasional,
          fasilitas: row.fasilitas,
          harga_tiket_dewasa: row.harga_tiket_dewasa,
          harga_tiket_anak: row.harga_tiket_anak,
          harga_tiket: row.harga_tiket,
          featured: row.featured,
          is_active: row.is_active,
          url_gambar_cdn: row.url_gambar_cdn,
          gambar_public_id: row.gambar_public_id,
          gambar_metadata: row.gambar_metadata,
          created_at: row.destinasi_created_at,
          updated_at: row.destinasi_updated_at
        }
      }));
    } catch (error) {
      throw new Error(`Error fetching paket with destinasi: ${error.message}`);
    }
  }

  /**
   * Create paket-destinasi link
   * @param {Object} data - { id_paket, id_destinasi, urutan }
   * @returns {Object} - created link
   */
  static async createPaketDestinasi(data) {
    try {
      const { id_paket, id_destinasi, urutan } = data;

      // Validation
      if (!id_paket || isNaN(id_paket)) {
        const error = new Error('id_paket harus berupa angka');
        error.statusCode = 400;
        throw error;
      }

      if (!id_destinasi || isNaN(id_destinasi)) {
        const error = new Error('id_destinasi harus berupa angka');
        error.statusCode = 400;
        throw error;
      }

      // Validate urutan is NOT NULL
      if (urutan === undefined || urutan === null) {
        const error = new Error('urutan harus diisi dan tidak boleh kosong');
        error.statusCode = 400;
        throw error;
      }

      if (isNaN(urutan)) {
        const error = new Error('urutan harus berupa angka');
        error.statusCode = 400;
        throw error;
      }

      // Check if paket exists
      const paketCheck = await pool.query(
        'SELECT id_paket FROM paket_wisata WHERE id_paket = $1 AND deleted_at IS NULL',
        [id_paket]
      );

      if (paketCheck.rows.length === 0) {
        const error = new Error('Paket wisata tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      // Check if destinasi exists
      const destinasiCheck = await pool.query(
        'SELECT id_destinasi FROM destinasi WHERE id_destinasi = $1 AND deleted_at IS NULL',
        [id_destinasi]
      );

      if (destinasiCheck.rows.length === 0) {
        const error = new Error('Destinasi tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      // Check for duplicate link (same paket-destinasi pair)
      const dupCheck = await pool.query(
        'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket = $1 AND id_destinasi = $2',
        [id_paket, id_destinasi]
      );

      if (dupCheck.rows.length > 0) {
        const error = new Error('Link paket-destinasi sudah ada');
        error.statusCode = 409;
        throw error;
      }

      // Check for duplicate urutan in same paket
      const urutanCheck = await pool.query(
        'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket = $1 AND urutan = $2',
        [id_paket, urutan]
      );

      if (urutanCheck.rows.length > 0) {
        const error = new Error('Urutan sudah digunakan dalam paket ini');
        error.statusCode = 409;
        throw error;
      }

      // Insert link
      const insertQuery = `
        INSERT INTO paket_destinasi (id_paket, id_destinasi, urutan, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING id_paket_destinasi, id_paket, id_destinasi, urutan, created_at
      `;

      const result = await pool.query(insertQuery, [
        id_paket,
        id_destinasi,
        urutan
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update paket-destinasi urutan
   * @param {number} id - id_paket_destinasi
   * @param {Object} data - { urutan }
   * @returns {Object} - updated link
   */
  static async updatePaketDestinasi(id, data) {
    try {
      const { urutan } = data;

      // Check if link exists and get paket info
      const checkQuery = 'SELECT id_paket_destinasi, id_paket FROM paket_destinasi WHERE id_paket_destinasi = $1';
      const checkResult = await pool.query(checkQuery, [id]);

      if (checkResult.rows.length === 0) {
        const error = new Error('Link paket-destinasi tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      const currentLink = checkResult.rows[0];
      const idPaket = currentLink.id_paket;

      // Validation
      if (urutan === undefined || urutan === null) {
        const error = new Error('urutan harus diisi dan tidak boleh kosong');
        error.statusCode = 400;
        throw error;
      }

      if (isNaN(urutan)) {
        const error = new Error('urutan harus berupa angka');
        error.statusCode = 400;
        throw error;
      }

      // Check for duplicate urutan in same paket (excluding current link)
      const urutanCheck = await pool.query(
        'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket = $1 AND urutan = $2 AND id_paket_destinasi != $3',
        [idPaket, urutan, id]
      );

      if (urutanCheck.rows.length > 0) {
        const error = new Error('Urutan sudah digunakan dalam paket ini');
        error.statusCode = 409;
        throw error;
      }

      // Update urutan
      const updateQuery = `
        UPDATE paket_destinasi
        SET urutan = $1
        WHERE id_paket_destinasi = $2
        RETURNING id_paket_destinasi, id_paket, id_destinasi, urutan, created_at
      `;

      const result = await pool.query(updateQuery, [urutan, id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete paket-destinasi link
   * @param {number} id - id_paket_destinasi
   * @returns {Object} - deleted link
   */
  static async deletePaketDestinasi(id) {
    try {
      // Check if link exists
      const checkQuery = 'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket_destinasi = $1';
      const checkResult = await pool.query(checkQuery, [id]);

      if (checkResult.rows.length === 0) {
        const error = new Error('Link paket-destinasi tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      // Delete (hard delete for junction table is ok)
      const deleteQuery = `
        DELETE FROM paket_destinasi
        WHERE id_paket_destinasi = $1
        RETURNING id_paket_destinasi, id_paket, id_destinasi, urutan, created_at
      `;

      const result = await pool.query(deleteQuery, [id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create multiple paket-destinasi links at once
   * @param {number} idPaket - id_paket
   * @param {Array} destinasiIds - [id_destinasi1, id_destinasi2, ...]
   * @returns {Array} - created links
   */
  static async createMultiplePaketDestinasi(idPaket, destinasiIds) {
    try {
      if (!Array.isArray(destinasiIds) || destinasiIds.length === 0) {
        const error = new Error('destinasiIds harus berupa array dan tidak kosong');
        error.statusCode = 400;
        throw error;
      }

      // Check if paket exists
      const paketCheck = await pool.query(
        'SELECT id_paket FROM paket_wisata WHERE id_paket = $1 AND deleted_at IS NULL',
        [idPaket]
      );

      if (paketCheck.rows.length === 0) {
        const error = new Error('Paket wisata tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      const results = [];
      let urutan = 0;

      for (let i = 0; i < destinasiIds.length; i++) {
        const idDestinasi = destinasiIds[i];

        // Check if destinasi exists
        const destinasiCheck = await pool.query(
          'SELECT id_destinasi FROM destinasi WHERE id_destinasi = $1 AND deleted_at IS NULL',
          [idDestinasi]
        );

        if (destinasiCheck.rows.length === 0) {
          continue; // Skip non-existent destinasi
        }

        // Check for duplicate link (same paket-destinasi pair)
        const dupCheck = await pool.query(
          'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket = $1 AND id_destinasi = $2',
          [idPaket, idDestinasi]
        );

        if (dupCheck.rows.length > 0) {
          continue; // Skip duplicate links
        }

        // Check for duplicate urutan in same paket
        const urutanCheck = await pool.query(
          'SELECT id_paket_destinasi FROM paket_destinasi WHERE id_paket = $1 AND urutan = $2',
          [idPaket, urutan]
        );

        if (urutanCheck.rows.length > 0) {
          urutan++; // Increment urutan if conflict
        }

        // Insert link with explicit urutan
        const insertQuery = `
          INSERT INTO paket_destinasi (id_paket, id_destinasi, urutan, created_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          RETURNING id_paket_destinasi, id_paket, id_destinasi, urutan, created_at
        `;

        const result = await pool.query(insertQuery, [
          idPaket,
          idDestinasi,
          urutan
        ]);

        results.push(result.rows[0]);
        urutan++;
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaketDestinationService;
