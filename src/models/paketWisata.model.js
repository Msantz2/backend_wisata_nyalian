const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaketWisata = sequelize.define('PaketWisata', {
  id_paket: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_paket: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deskripsi_paket: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  harga_per_pax: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kuota_default: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  deskripsi_pendek: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  durasi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  durasi_hari: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  durasi_jam: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  kapasitas_min: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true
  },
  kapasitas_max: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  highlights: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  included: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  excluded: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  itinerary: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: true
  },
  id_kategori: {
    type: DataTypes.INTEGER,
    references: {
      model: 'kategori_paket',
      key: 'id_kategori'
    },
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
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
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
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
  }
}, {
  tableName: 'paket_wisata',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PaketWisata;
