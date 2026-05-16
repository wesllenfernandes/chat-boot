const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CacheIA = sequelize.define('CacheIA', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  chave: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'cache_ia',
  timestamps: true
});

module.exports = CacheIA;
