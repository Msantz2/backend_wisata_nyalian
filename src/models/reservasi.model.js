const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservasi = sequelize.define('Reservasi', {
  id_reservasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_booking: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  id_wisatawan: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'wisatawan',
      key: 'id_wisatawan'
    }
  },
  id_paket: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'paket_wisata',
      key: 'id_paket'
    }
  },
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admin',
      key: 'id_admin'
    }
  },
  tanggal_kunjungan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  jumlah_pax: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_harga: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipe_reservasi: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status_reservasi: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Lunas'
  },
  waktu_dibuat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  catatan_admin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tanggal_batas_pembayaran: {
    type: DataTypes.DATEONLY,
    allowNull: true
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
  }
}, {
  tableName: 'reservasi',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = Reservasi;
