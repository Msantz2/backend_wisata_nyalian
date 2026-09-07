const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaketDestinasi = sequelize.define('PaketDestinasi', {
  id_paket_destinasi: {
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
  id_destinasi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'destinasi',
      key: 'id_destinasi'
    }
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'paket_destinasi',
  timestamps: false,
  underscored: true
});

module.exports = PaketDestinasi;
