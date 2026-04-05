require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./src/config/database');
const { Cliente, Pedido, ItemPedido } = require('./src/models');
const WhatsAppController = require('./src/controllers/WhatsAppController');
const TimeoutService = require('./src/services/TimeoutService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Chatbot da Pizzaria - API Online',
    versao: '1.0.0',
    status: 'rodando'
  });
});

app.get('/status', (req, res) => {
  const whatsappStatus = whatsappController ? whatsappController.getStatus() : null;
  res.json({
    servidor: 'online',
    whatsapp: whatsappStatus ? 'conectado' : 'desconectado',
    banco: 'sqlite',
    timestamp: new Date().toISOString()
  });
});

app.get('/pedidos/:telefone', async (req, res) => {
  try {
    const { PedidoService } = require('./src/services/PedidoService');
    const { ClienteService } = require('./src/services/ClienteService');
    
    const telefone = req.params.telefone;
    const cliente = await ClienteService.buscarOuCriar(telefone);
    const pedidos = await PedidoService.buscarPedidosPorCliente(cliente.id);
    
    res.json({
      sucesso: true,
      pedidos: pedidos
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

// Inicialização
let whatsappController;

async function startServer() {
  try {
    // Testar conexão com o banco
    console.log('🔌 Conectando ao banco de dados...');
    await testConnection();
    
    // Sincronizar models com o banco
    console.log('📊 Sincronizando models com o banco de dados...');
    await sequelize.sync({ alter: true });
    console.log('✅ Models sincronizados com sucesso!');
    console.log('💾 O banco de dados será criado automaticamente em: database.sqlite');
    
    // Inicializar WhatsApp
    console.log('📱 Inicializando WhatsApp Web...');
    whatsappController = new WhatsAppController();
    
    await whatsappController.initialize();
    
    // Aguardar o WhatsApp estar pronto antes de iniciar o sistema de timeout
    whatsappController.client.once('ready', () => {
      console.log('\n✅ Cliente WhatsApp conectado com sucesso!');
      console.log('🤖 Chatbot da Pizzaria está online!\n');
      
      // Iniciar sistema de timeout
      TimeoutService.iniciarVerificacao(whatsappController);
    });
    
    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════╗');
      console.log(`║   SERVIDOR RODANDO NA PORTA ${PORT}       ║`);
      console.log('╚════════════════════════════════════════╝\n');
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Encerrando servidor...');
  
  // Parar sistema de timeout
  TimeoutService.pararVerificacao();
  
  if (whatsappController) {
    await whatsappController.client.destroy();
  }
  await sequelize.close();
  console.log('👋 Servidor encerrado com sucesso!');
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
