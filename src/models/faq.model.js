/**
 * FAQ Model
 * Representasi struktur tabel faq
 * 
 * TABLE: faq
 * - id_faq (serial, PK)
 * - pertanyaan (varchar)
 * - jawaban (text)
 * - kategori (varchar, nullable)
 * - urutan (integer, nullable)
 * - featured (boolean, default false)
 * - is_active (boolean, default true)
 * - created_at (timestamp, default CURRENT_TIMESTAMP)
 * - updated_at (timestamp, default CURRENT_TIMESTAMP)
 */

const FAQModel = {
  tableName: 'faq',
  
  fields: {
    id_faq: {
      type: 'serial',
      primaryKey: true,
      autoIncrement: true
    },
    pertanyaan: {
      type: 'varchar',
      allowNull: false
    },
    jawaban: {
      type: 'text',
      allowNull: false
    },
    kategori: {
      type: 'varchar',
      allowNull: true
    },
    urutan: {
      type: 'integer',
      allowNull: true
    },
    featured: {
      type: 'boolean',
      default: false,
      allowNull: false
    },
    is_active: {
      type: 'boolean',
      default: true,
      allowNull: false
    },
    created_at: {
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      allowNull: false
    },
    updated_at: {
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      allowNull: false
    }
  }
};

module.exports = FAQModel;
