const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tiket = sequelize.define('Tiket', {
  id_tiket: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_reservasi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'reservasi',
      key: 'id_reservasi'
    }
  },
  kode_qr_token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  status_tiket: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Belum Digunakan'
  },
  waktu_scan: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'tiket',
  timestamps: false,
  underscored: true
});

module.exports = Tiket;
