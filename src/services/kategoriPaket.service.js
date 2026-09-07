/**
 * Kategori Paket Service
 * Business logic untuk modul kategori_paket
 * Menggunakan raw SQL + pg library (NO ORM)
 */

const { pool } = require('../config/database');

class KategoriPaketService {
  /**
   * Get all kategori paket dengan pagination
   * @param {Object} filters - { page, limit, search, sort, order }
   * @returns {Object} - { data: [], meta: { page, limit, total } }
   */
  static async getAllKategoriPaket(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sort = 'id_kategori',
        order = 'ASC'
      } = filters;

      const offset = (page - 1) * limit;
      const allowedSortFields = ['id_kategori', 'nama_kategori', 'created_at'];
      const sortField = allowedSortFields.includes(sort) ? sort : 'id_kategori';
      const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Build WHERE clause
      let whereClause = 'WHERE deleted_at IS NULL';
      const queryParams = [];

      if (search && search.trim()) {
        whereClause += ' AND nama_kategori ILIKE $1';
        queryParams.push(`%${search}%`);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM kategori_paket ${whereClause}`;
      const countResult = await pool.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Get paginated data
      const dataQuery = `
        SELECT 
          id_kategori,
          nama_kategori,
          slug,
          deskripsi_kategori,
          is_active,
          created_at,
          updated_at,
          deleted_at
        FROM kategori_paket
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
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
      throw new Error(`Error fetching kategori paket: ${error.message}`);
    }
  }

  /**
   * Get kategori paket by ID
   * @param {number} id - id_kategori
   * @returns {Object} - kategori paket
   */
  static async getKategoriPaketById(id) {
    try {
      const query = `
        SELECT 
          id_kategori,
          nama_kategori,
          slug,
          deskripsi_kategori,
          is_active,
          created_at,
          updated_at,
          deleted_at
        FROM kategori_paket
        WHERE id_kategori = $1 AND deleted_at IS NULL
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        const error = new Error('Kategori paket tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create kategori paket baru
   * @param {Object} data - { nama_kategori, slug, deskripsi_kategori }
   * @returns {Object} - created kategori paket
   */
  static async createKategoriPaket(data) {
    try {
      const { nama_kategori, slug, deskripsi_kategori } = data;

      // Validation
      if (!nama_kategori || !nama_kategori.trim()) {
        const error = new Error('nama_kategori wajib diisi');
        error.statusCode = 400;
        throw error;
      }

      if (!slug || !slug.trim()) {
        const error = new Error('slug wajib diisi');
        error.statusCode = 400;
        throw error;
      }

      // Check for duplicates
      const checkQuery = `
        SELECT id_kategori FROM kategori_paket 
        WHERE nama_kategori = $1 OR slug = $2
      `;
      const checkResult = await pool.query(checkQuery, [nama_kategori.trim(), slug.trim()]);

      if (checkResult.rows.length > 0) {
        const error = new Error('nama_kategori atau slug sudah digunakan');
        error.statusCode = 409;
        throw error;
      }

      // Insert kategori paket
      const insertQuery = `
        INSERT INTO kategori_paket (nama_kategori, slug, deskripsi_kategori, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id_kategori, nama_kategori, slug, deskripsi_kategori, is_active, created_at, updated_at
      `;

      const result = await pool.query(insertQuery, [
        nama_kategori.trim(),
        slug.trim(),
        deskripsi_kategori || null
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update kategori paket
   * @param {number} id - id_kategori
   * @param {Object} data - { nama_kategori, slug, deskripsi_kategori, is_active }
   * @returns {Object} - updated kategori paket
   */
  static async updateKategoriPaket(id, data) {
    try {
      // Check if kategori exists
      await this.getKategoriPaketById(id);

      const { nama_kategori, slug, deskripsi_kategori, is_active } = data;
      const updateFields = [];
      const updateParams = [];
      let paramCount = 1;

      if (nama_kategori !== undefined) {
        if (!nama_kategori.trim()) {
          const error = new Error('nama_kategori tidak boleh kosong');
          error.statusCode = 400;
          throw error;
        }
        updateFields.push(`nama_kategori = $${paramCount}`);
        updateParams.push(nama_kategori.trim());
        paramCount++;
      }

      if (slug !== undefined) {
        if (!slug.trim()) {
          const error = new Error('slug tidak boleh kosong');
          error.statusCode = 400;
          throw error;
        }
        updateFields.push(`slug = $${paramCount}`);
        updateParams.push(slug.trim());
        paramCount++;
      }

      if (deskripsi_kategori !== undefined) {
        updateFields.push(`deskripsi_kategori = $${paramCount}`);
        updateParams.push(deskripsi_kategori || null);
        paramCount++;
      }

      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramCount}`);
        updateParams.push(is_active);
        paramCount++;
      }

      // Check for duplicate nama_kategori or slug (if being updated)
      if (nama_kategori || slug) {
        const checkQuery = `
          SELECT id_kategori FROM kategori_paket 
          WHERE (nama_kategori = $1 OR slug = $2) AND id_kategori != $3
        `;
        const checkResult = await pool.query(checkQuery, [
          nama_kategori?.trim() || null,
          slug?.trim() || null,
          id
        ]);

        if (checkResult.rows.length > 0) {
          const error = new Error('nama_kategori atau slug sudah digunakan');
          error.statusCode = 409;
          throw error;
        }
      }

      updateFields.push(`updated_at = $${paramCount}`);
      updateParams.push(new Date());
      paramCount++;

      if (updateFields.length === 0) {
        const error = new Error('Tidak ada data yang diupdate');
        error.statusCode = 400;
        throw error;
      }

      updateParams.push(id);

      const updateQuery = `
        UPDATE kategori_paket
        SET ${updateFields.join(', ')}
        WHERE id_kategori = $${paramCount}
        RETURNING id_kategori, nama_kategori, slug, deskripsi_kategori, is_active, created_at, updated_at
      `;

      const result = await pool.query(updateQuery, updateParams);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
    * Soft delete kategori paket
    * @param {number} id - id_kategori
    * @returns {Object} - deleted kategori paket
    */
  static async deleteKategoriPaket(id) {
    try {
      // Check if kategori exists
      await this.getKategoriPaketById(id);

      // Soft delete: set deleted_at to current timestamp
      const deleteQuery = `
        UPDATE kategori_paket
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id_kategori = $1
        RETURNING id_kategori, nama_kategori, slug, deskripsi_kategori, is_active, created_at, updated_at, deleted_at
      `;

      const result = await pool.query(deleteQuery, [id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = KategoriPaketService;
