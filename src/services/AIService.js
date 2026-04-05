const OllamaService = require('./OllamaService');

class AIService {
  constructor() {
    this.ollama = OllamaService;
  }

  async gerarResposta(mensagem, contexto = {}) {
    try {
      console.log('🤖 Usando Ollama para gerar resposta');
      return await this.ollama.gerarResposta(mensagem, contexto);
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
    }
  }

  async interpretarPedido(mensagem, contexto = {}) {
    try {
      console.log('🤖 Usando Ollama para interpretar pedido');
      return await this.ollama.interpretarPedido(mensagem, contexto);
    } catch (error) {
      console.error('Erro ao interpretar pedido:', error);
      return { ePedido: false, produtos: [], resposta: null };
    }
  }

  async interpretarIntencao(mensagem, itensNoCarrinho) {
    try {
      console.log('🤖 Usando Ollama para interpretar intenção');
      return await this.ollama.interpretarIntencao(mensagem, itensNoCarrinho);
    } catch (error) {
      console.error('Erro ao interpretar intenção:', error);
      return { intencao: 'nenhuma', ePedido: false, produtos: [] };
    }
  }

  async transcreverAudio(audioBuffer) {
    try {
      console.log('🎤 Usando Ollama Whisper para transcrição');
      return await this.ollama.transcreverAudio(audioBuffer);
    } catch (error) {
      console.error('Erro ao transcrever áudio:', error);
      throw error;
    }
  }
}

module.exports = new AIService();