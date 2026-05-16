const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Produto = sequelize.define('Produto', {
  nome: { type: DataTypes.STRING, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, defaultValue: '' },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'produtos' });

module.exports = Produto;
