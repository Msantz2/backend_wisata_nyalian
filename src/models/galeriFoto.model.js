const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GaleriFoto = sequelize.define('GaleriFoto', {
  id_galeri: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_destinasi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'destinasi',
      key: 'id_destinasi'
    }
  },
  url_foto_cdn: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tipe_media: {
    type: DataTypes.STRING(20),
    defaultValue: 'foto',
    allowNull: true
  },
  created_at: {
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
  foto_public_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  foto_metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: true
  }
}, {
  tableName: 'galeri_foto',
  timestamps: false,
  underscored: true
});

module.exports = GaleriFoto;
