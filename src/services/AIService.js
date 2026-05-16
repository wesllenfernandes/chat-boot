const OllamaService = require('./OllamaService');
const cache = require('./CacheService');

class AIService {
  constructor() {
    this.ollama = OllamaService;
  }

  async gerarResposta(mensagem, contexto = {}) {
    try {
      const cached = await cache.get('resposta', mensagem);
      if (cached) return cached;
      console.log('🤖 Usando Ollama para gerar resposta');
      const resposta = await this.ollama.gerarResposta(mensagem, contexto);
      await cache.set('resposta', mensagem, resposta);
      return resposta;
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
    }
  }

  async interpretarPedido(mensagem, contexto = {}) {
    try {
      const cached = await cache.get('pedido', mensagem);
      if (cached) return cached;
      console.log('🤖 Usando Ollama para interpretar pedido');
      const resultado = await this.ollama.interpretarPedido(mensagem, contexto);
      await cache.set('pedido', mensagem, resultado);
      return resultado;
    } catch (error) {
      console.error('Erro ao interpretar pedido:', error);
      return { ePedido: false, produtos: [], resposta: null };
    }
  }

  async interpretarIntencao(mensagem, itensNoCarrinho) {
    try {
      const cached = await cache.get('intencao', mensagem);
      if (cached) return cached;
      console.log('🤖 Usando Ollama para interpretar intenção');
      const resultado = await this.ollama.interpretarIntencao(mensagem, itensNoCarrinho);
      await cache.set('intencao', mensagem, resultado);
      return resultado;
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
