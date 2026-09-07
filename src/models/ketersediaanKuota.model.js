const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KetersediaanKuota = sequelize.define('KetersediaanKuota', {
  id_kuota: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_paket: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'paket_wisata',
      key: 'id_paket'
    }
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sisa_kuota: {
    type: DataTypes.INTEGER,
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
  tableName: 'ketersediaan_kuota',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = KetersediaanKuota;
