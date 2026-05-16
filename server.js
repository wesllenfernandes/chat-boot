process.env.TZ = process.env.TZ || 'America/Sao_Paulo';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, testConnection } = require('./src/config/database');
const { Cliente, Pedido, ItemPedido } = require('./src/models');
const WhatsAppController = require('./src/controllers/WhatsAppController');
const TimeoutService = require('./src/services/TimeoutService');
const adminRoutes = require('./src/routes/admin');
const { inicializar: inicializarCardapio } = require('./src/config/cardapio');
const HorarioService = require('./src/services/HorarioService');
const EmpresaService = require('./src/services/EmpresaService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Rotas
app.use('/admin', adminRoutes);

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

app.get('/cache', async (req, res) => {
  const cache = require('./src/services/CacheService');
  const { tipo } = req.query;
  const [stats, entradas] = await Promise.all([
    cache.estatisticas(),
    cache.listar(tipo || null)
  ]);
  res.json({ stats, entradas });
});

app.delete('/cache', async (req, res) => {
  const cache = require('./src/services/CacheService');
  await cache.limparTudo();
  res.json({ mensagem: 'Cache completamente limpo.' });
});

app.delete('/cache/:id', async (req, res) => {
  const cache = require('./src/services/CacheService');
  const removido = await cache.limparEntrada(Number(req.params.id));
  res.json({ removido });
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
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await sequelize.query('DROP TABLE IF EXISTS `clientes_backup`;');
    await sequelize.query('DROP TABLE IF EXISTS `pedidos_backup`;');
    await sequelize.query('DROP TABLE IF EXISTS `item_pedidos_backup`;');
    await sequelize.sync({ alter: true });
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('✅ Models sincronizados com sucesso!');

    // Inicializar cardápio (seed + carregar do banco)
    await inicializarCardapio();
    console.log('🍕 Cardápio carregado do banco de dados!');

    // Inicializar horários de funcionamento
    await HorarioService.inicializar();
    console.log('🕐 Horários de funcionamento carregados!');

    // Inicializar dados da empresa
    await EmpresaService.inicializar();
    console.log('🏢 Dados da empresa carregados!');
    console.log('💾 O banco de dados será criado automaticamente em: database.sqlite');
    
    // Inicializar WhatsApp
    console.log('📱 Inicializando WhatsApp Web...');
    whatsappController = new WhatsAppController();
    app.locals.whatsappController = whatsappController;
    
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
