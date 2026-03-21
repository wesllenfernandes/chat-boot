const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  etapa_atual: {
    type: DataTypes.ENUM('MENU', 'ESCOLHENDO_PRODUTO', 'QUANTIDADE', 'PAGAMENTO', 'ENDERECO', 'CONFIRMACAO'),
    allowNull: false,
    defaultValue: 'MENU'
  },
  produto_selecionado: {
    type: DataTypes.JSON,
    allowNull: true
  },
  itens_pedido: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

module.exports = Cliente;
