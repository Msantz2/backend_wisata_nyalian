const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Destinasi = sequelize.define('Destinasi', {
  id_destinasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_kategori: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kategori_destinasi',
      key: 'id_kategori'
    }
  },
  nama_destinasi: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deskripsi_pendek: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lokasi_maps: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  jam_operasional: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  jam_buka: {
    type: DataTypes.TIME,
    allowNull: true
  },
  jam_tutup: {
    type: DataTypes.TIME,
    allowNull: true
  },
  fasilitas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  harga_tiket: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  harga_tiket_dewasa: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  harga_tiket_anak: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  desa: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Nyalian'
  },
  provinsi: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Bali'
  },
  kabupaten: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Klungkung'
  },
  kecamatan: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Banjarangkan'
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
  tableName: 'destinasi',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Destinasi;
