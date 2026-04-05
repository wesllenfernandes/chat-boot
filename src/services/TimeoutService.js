const { Cliente } = require('../models');

class TimeoutService {
  constructor() {
    this.TEMPO_AVISO = 2 * 60 * 1000; // 2 minutos em milissegundos
    this.TEMPO_TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos
    this.checkInterval = null;
  }

  iniciarVerificacao(whatsappController) {
    // Verificar a cada 30 segundos
    this.checkInterval = setInterval(async () => {
      await this.verificarTimeouts(whatsappController);
    }, 30000);
    
    console.log('⏰ Sistema de timeout iniciado (aviso: 2min, encerrar: 5min)');
  }

  async verificarTimeouts(whatsappController) {
    try {
      const agora = new Date();
      const clientes = await Cliente.findAll();

      for (const cliente of clientes) {
        if (!cliente.ultima_interacao) continue;

        const ultimaInteracao = new Date(cliente.ultima_interacao);
        const tempoDecorrido = agora - ultimaInteracao;

        // Verifica se passou 5 minutos (encerrar atendimento)
        if (tempoDecorrido >= this.TEMPO_TIMEOUT) {
          await this.encerrarAtendimento(cliente, whatsappController);
        }
        // Verifica se passou 2 minutos (enviar aviso)
        else if (tempoDecorrido >= this.TEMPO_AVISO && !cliente.aviso_timeout_enviado) {
          await this.enviarAvisoTimeout(cliente, whatsappController);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar timeouts:', error);
    }
  }

  async enviarAvisoTimeout(cliente, whatsappController) {
    try {
      const mensagem = '⏰ *Aviso de Inatividade*\n\n' +
                      'Percebemos que você está demorando para responder.\n' +
                      '⏱️ Você tem mais 3 minutos antes que o atendimento seja encerrado.\n\n' +
                      '📝 Para continuar, basta enviar qualquer mensagem.\n\n' +
                      'Se quiser reiniciar, digite "menu"';

      await whatsappController.sendMessage(cliente.telefone, mensagem);
      
      // Marcar que o aviso foi enviado
      await cliente.update({ aviso_timeout_enviado: true });
      
      console.log(`⏰ Aviso de timeout enviado para ${cliente.telefone}`);
    } catch (error) {
      console.error(`Erro ao enviar aviso para ${cliente.telefone}:`, error);
    }
  }

  async encerrarAtendimento(cliente, whatsappController) {
    try {
      const mensagem = '⏰ *Atendimento Encerrado*\n\n' +
                      'Seu atendimento foi encerrado devido à inatividade (5 minutos sem resposta).\n\n' +
                      '🍕 Se quiser fazer um novo pedido, envie qualquer mensagem.\n\n' +
                      'Estamos aguardando seu retorno!';

      await whatsappController.sendMessage(cliente.telefone, mensagem);
      
      // Limpar dados do cliente
      await cliente.update({
        itens_pedido: [],
        produto_selecionado: null,
        etapa_atual: 'MENU',
        aviso_timeout_enviado: false
      });
      
      console.log(`⏰ Atendimento encerrado para ${cliente.telefone}`);
    } catch (error) {
      console.error(`Erro ao encerrar atendimento para ${cliente.telefone}:`, error);
    }
  }

  pararVerificacao() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      console.log('⏰ Sistema de timeout parado');
    }
  }
}

module.exports = new TimeoutService();
