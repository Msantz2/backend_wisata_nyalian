const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pembayaran = sequelize.define('Pembayaran', {
  id_pembayaran: {
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
  metode_bayar: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  waktu_bayar: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  bukti_transfer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status_pembayaran: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending'
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
  tableName: 'pembayaran',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Pembayaran;
