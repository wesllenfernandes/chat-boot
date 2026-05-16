const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CidadeEntrega = sequelize.define('CidadeEntrega', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cidade: { type: DataTypes.STRING(100), allowNull: false },
  taxa_entrega: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  ativa: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'cidades_entrega', timestamps: true });

module.exports = CidadeEntrega;
