const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wisatawan = sequelize.define('Wisatawan', {
  id_wisatawan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_lengkap: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  no_whatsapp: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  jenis_kelamin: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  }
}, {
  tableName: 'wisatawan',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Wisatawan;
