const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UlasanWisatawan = sequelize.define('UlasanWisatawan', {
  id_ulasan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_reservasi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'reservasi',
      key: 'id_reservasi'
    }
  },
  rating_bintang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  komentar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tanggal_ulasan: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ulasan_wisatawan',
  timestamps: false
});

module.exports = UlasanWisatawan;
