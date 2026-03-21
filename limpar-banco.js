const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

console.log('🗑️  Limpando banco de dados...');

if (fs.existsSync(dbPath)) {
  try {
    // Fazer backup se existir
    const backupPath = path.join(__dirname, 'database.sqlite.backup');
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      console.log('✅ Backup criado: database.sqlite.backup');
    }
    
    // Deletar arquivo
    fs.unlinkSync(dbPath);
    console.log('✅ Banco de dados deletado com sucesso!');
    console.log('\n🚀 Execute "npm start" para criar um novo banco de dados.');
  } catch (error) {
    console.error('❌ Erro ao deletar banco de dados:', error);
    process.exit(1);
  }
} else {
  console.log('⚠️  Nenhum banco de dados encontrado.');
  console.log('\n🚀 Execute "npm start" para criar um novo banco de dados.');
}
