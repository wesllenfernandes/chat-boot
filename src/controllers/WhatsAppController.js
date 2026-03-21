const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ChatbotService = require('../services/ChatbotService');

class WhatsAppController {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: process.env.WHATSAPP_SESSION_PATH || './sessions'
      }),
      puppeteer: {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--window-size=1366,768'
        ],
        defaultViewport: {
          width: 1366,
          height: 768
        }
      }
    });
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // QR Code
    this.client.on('qr', (qr) => {
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║  QR CODE GERADO - ESCANEIE COM WHATSAPP ║');
      console.log('╚════════════════════════════════════════╝\n');
      qrcode.generate(qr, { small: true });
      console.log('\nAguardando leitura do QR Code...\n');
    });
    
    // Pronto
    this.client.on('ready', () => {
      console.log('\n✅ Cliente WhatsApp conectado com sucesso!');
      console.log('🤖 Chatbot da Pizzaria está online!\n');
    });
    
    // Autenticação
    this.client.on('authenticated', () => {
      console.log('✅ Autenticado com sucesso!');
    });
    
    // Falha na autenticação
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Falha na autenticação:', msg);
    });
    
    // Mensagem recebida
    this.client.on('message', async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        message.reply('❌ Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
      }
    });
    
    // Erro
    this.client.on('error', (error) => {
      console.error('Erro no cliente WhatsApp:', error);
    });
  }
  
  async handleMessage(message) {
    const telefone = message.from;
    const texto = message.body;
    
    // Ignorar mensagens de grupos
    if (message.from.includes('@g.us')) {
      return;
    }
    
    // Log da mensagem recebida
    console.log(`\n📩 Mensagem recebida de ${telefone}: ${texto}`);
    
    // Processar mensagem
    const resultado = await ChatbotService.processarMensagem(telefone, texto);
    
    // Enviar resposta
    await message.reply(resultado.resposta);
    
    // Log da resposta enviada
    console.log(`📤 Resposta enviada para ${telefone}`);
    console.log(`📝 Conteúdo: ${resultado.resposta.substring(0, 100)}...`);
  }
  
  async initialize() {
    try {
      console.log('\n🚀 Inicializando cliente WhatsApp...');
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Erro ao inicializar cliente WhatsApp:', error);
      throw error;
    }
  }
  
  async sendMessage(telefone, mensagem) {
    try {
      await this.client.sendMessage(telefone + '@c.us', mensagem);
      console.log(`✅ Mensagem enviada para ${telefone}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem para ${telefone}:`, error);
      throw error;
    }
  }
  
  getStatus() {
    return this.client.info;
  }
}

module.exports = WhatsAppController;
