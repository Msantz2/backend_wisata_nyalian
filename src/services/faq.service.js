/**
 * FAQ Service
 * Business logic untuk modul faq
 * Menggunakan raw SQL + pg library (NO ORM)
 */

const { pool } = require('../config/database');

class FAQService {
  /**
   * Get all FAQ dengan pagination
   * @param {Object} filters - { page, limit, search, featured, is_active, sort, order }
   * @returns {Object} - { data: [], meta: { page, limit, total } }
   */
  static async getAllFAQ(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        featured = null,
        is_active = true,
        sort = 'urutan',
        order = 'ASC'
      } = filters;

      const offset = (page - 1) * limit;
      const allowedSortFields = ['id_faq', 'pertanyaan', 'urutan', 'created_at', 'featured'];
      const sortField = allowedSortFields.includes(sort) ? sort : 'urutan';
      const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Build WHERE clause
      const whereConditions = [];
      const queryParams = [];
      let paramCount = 1;

      // deleted_at filter - always exclude deleted records
      whereConditions.push(`deleted_at IS NULL`);

      // search filter
      if (search && search.trim()) {
        whereConditions.push(`(pertanyaan ILIKE $${paramCount} OR jawaban ILIKE $${paramCount})`);
        queryParams.push(`%${search}%`);
        paramCount++;
      }

      // featured filter
      if (featured !== null && featured !== undefined) {
        whereConditions.push(`featured = $${paramCount}`);
        queryParams.push(featured);
        paramCount++;
      }

      // is_active filter
      if (is_active !== null) {
        whereConditions.push(`is_active = $${paramCount}`);
        queryParams.push(is_active);
        paramCount++;
      }

      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM faq ${whereClause}`;
      const countResult = await pool.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Get paginated data
      const dataQuery = `
        SELECT 
          id_faq,
          pertanyaan,
          jawaban,
          kategori,
          urutan,
          featured,
          is_active,
          created_at,
          updated_at,
          deleted_at
        FROM faq
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
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
      throw new Error(`Error fetching FAQ: ${error.message}`);
    }
  }

  /**
   * Get FAQ by ID
   * @param {number} id - id_faq
   * @returns {Object} - faq
   */
    static async getFAQById(id) {
      try {
        const query = `
          SELECT 
            id_faq,
            pertanyaan,
            jawaban,
            kategori,
            urutan,
            featured,
            is_active,
            created_at,
            updated_at,
            deleted_at
          FROM faq
          WHERE id_faq = $1 AND deleted_at IS NULL
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
          const error = new Error('FAQ tidak ditemukan');
          error.statusCode = 404;
          throw error;
        }

        return result.rows[0];
      } catch (error) {
        throw error;
      }
    }

  /**
    * Create FAQ baru
    * @param {Object} data - { pertanyaan, jawaban, urutan, featured }
    * @returns {Object} - created FAQ
    */
  static async createFAQ(data) {
    try {
      const { pertanyaan, jawaban, kategori, urutan, featured } = data;

      // Validation
      if (!pertanyaan || !pertanyaan.trim()) {
        const error = new Error('pertanyaan wajib diisi');
        error.statusCode = 400;
        throw error;
      }

      if (!jawaban || !jawaban.trim()) {
        const error = new Error('jawaban wajib diisi');
        error.statusCode = 400;
        throw error;
      }

      if (!kategori || !kategori.trim()) {
        const error = new Error('kategori wajib diisi');
        error.statusCode = 400;
        throw error;
      }

      // Insert FAQ
      const insertQuery = `
        INSERT INTO faq (pertanyaan, jawaban, kategori, urutan, featured, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id_faq, pertanyaan, jawaban, kategori, urutan, featured, is_active, created_at, updated_at
      `;

      const result = await pool.query(insertQuery, [
        pertanyaan.trim(),
        jawaban.trim(),
        kategori.trim(),
        urutan || null,
        featured || false
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update FAQ
   * @param {number} id - id_faq
   * @param {Object} data - { pertanyaan, jawaban, urutan, featured, is_active }
   * @returns {Object} - updated FAQ
   */
  static async updateFAQ(id, data) {
    try {
      // Check if FAQ exists
      await this.getFAQById(id);

      const { pertanyaan, jawaban, kategori, urutan, featured, is_active } = data;
      const updateFields = [];
      const updateParams = [];
      let paramCount = 1;

      if (pertanyaan !== undefined) {
        if (!pertanyaan.trim()) {
          const error = new Error('pertanyaan tidak boleh kosong');
          error.statusCode = 400;
          throw error;
        }
        updateFields.push(`pertanyaan = $${paramCount}`);
        updateParams.push(pertanyaan.trim());
        paramCount++;
      }

      if (jawaban !== undefined) {
        if (!jawaban.trim()) {
          const error = new Error('jawaban tidak boleh kosong');
          error.statusCode = 400;
          throw error;
        }
        updateFields.push(`jawaban = $${paramCount}`);
        updateParams.push(jawaban.trim());
        paramCount++;
      }

      if (kategori !== undefined) {
        if (!kategori.trim()) {
          const error = new Error('kategori tidak boleh kosong');
          error.statusCode = 400;
          throw error;
        }
        updateFields.push(`kategori = $${paramCount}`);
        updateParams.push(kategori.trim());
        paramCount++;
      }

      if (urutan !== undefined) {
        updateFields.push(`urutan = $${paramCount}`);
        updateParams.push(urutan || null);
        paramCount++;
      }

      if (featured !== undefined) {
        updateFields.push(`featured = $${paramCount}`);
        updateParams.push(featured);
        paramCount++;
      }

      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramCount}`);
        updateParams.push(is_active);
        paramCount++;
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
        UPDATE faq
        SET ${updateFields.join(', ')}
        WHERE id_faq = $${paramCount}
        RETURNING id_faq, pertanyaan, jawaban, kategori, urutan, featured, is_active, created_at, updated_at
      `;

      const result = await pool.query(updateQuery, updateParams);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
    * Soft delete FAQ
    * @param {number} id - id_faq
    * @returns {Object} - deleted FAQ
    */
  static async deleteFAQ(id) {
    try {
      // Check if FAQ exists
      await this.getFAQById(id);

      // Soft delete: set deleted_at to current timestamp
      const deleteQuery = `
        UPDATE faq
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id_faq = $1
        RETURNING id_faq, pertanyaan, jawaban, kategori, urutan, featured, is_active, created_at, updated_at, deleted_at
      `;

      const result = await pool.query(deleteQuery, [id]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FAQService;
