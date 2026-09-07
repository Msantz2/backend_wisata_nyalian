const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BeritaDesa = sequelize.define('BeritaDesa', {
  id_berita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admin',
      key: 'id_admin'
    }
  },
  judul_berita: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  isi_konten: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url_thumbnail_cdn: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  url_gambar_cdn: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gambar_public_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gambar_metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  kategori: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'draft',
    validate: {
      isIn: [['draft', 'published']]
    }
  },
  deskripsi_pendek: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  related_destinasi_ids: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  related_paket_ids: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  tanggal_publikasi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'admin',
      key: 'id_admin'
    },
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'admin',
      key: 'id_admin'
    },
    allowNull: true
  },
  deleted_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'admin',
      key: 'id_admin'
    },
    allowNull: true
  }
}, {
  tableName: 'berita_desa',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BeritaDesa;
