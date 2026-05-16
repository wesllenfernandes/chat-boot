const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HorarioFuncionamento = sequelize.define('HorarioFuncionamento', {
  dia_semana: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // 0=Dom ... 6=Sab
  nome: { type: DataTypes.STRING, allowNull: false },
  aberto: { type: DataTypes.BOOLEAN, defaultValue: false },
  hora_abertura: { type: DataTypes.STRING(5), defaultValue: '18:00' },
  hora_fechamento: { type: DataTypes.STRING(5), defaultValue: '23:00' }
}, { tableName: 'horarios_funcionamento' });

module.exports = HorarioFuncionamento;
