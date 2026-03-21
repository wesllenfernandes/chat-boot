const { Sequelize } = require('sequelize');
const path = require('path');

// Caminho para o arquivo SQLite
const dbPath = path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true,
    underscored: false
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco SQLite estabelecida com sucesso!');
    console.log(`📁 Arquivo do banco: ${dbPath}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
};

module.exports = { sequelize, testConnection };
