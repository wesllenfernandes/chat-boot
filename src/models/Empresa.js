const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Pizzaria Otaliva' },
  cidade: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
  estado: { type: DataTypes.STRING(2), allowNull: true },
  telefone: { type: DataTypes.STRING(30), allowNull: true },
  endereco: { type: DataTypes.STRING(200), allowNull: true },
  cnpj: { type: DataTypes.STRING(20), allowNull: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  taxa_entrega_sede: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, { tableName: 'empresa', timestamps: true });

module.exports = Empresa;
