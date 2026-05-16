const { Cliente } = require('../models');
const { Op } = require('sequelize');

class TimeoutService {
  constructor() {
    this.TEMPO_AVISO = 2 * 60 * 1000; // 2 minutos em milissegundos
    this.TEMPO_TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos
    this.checkInterval = null;
  }

  iniciarVerificacao(whatsappController) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

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
        if (this.isChatIgnorado(cliente.telefone)) continue;
        if (!cliente.ultima_interacao) continue;

        if (!this.temAtendimentoAtivo(cliente)) {
          await cliente.update({
            ultima_interacao: null,
            aviso_timeout_enviado: false
          });
          continue;
        }

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

      const marcouAviso = await this.marcarAvisoTimeout(cliente);
      if (!marcouAviso) return;

      await whatsappController.sendMessage(cliente.telefone, mensagem);
      
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

      const marcouEncerrado = await this.marcarAtendimentoEncerrado(cliente);
      if (!marcouEncerrado) return;

      await whatsappController.sendMessage(cliente.telefone, mensagem);
      
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

  isChatIgnorado(telefone) {
    return !telefone ||
      telefone.includes('@g.us') ||
      telefone.includes('@newsletter') ||
      telefone === 'status@broadcast' ||
      telefone.includes('@broadcast');
  }

  temAtendimentoAtivo(cliente) {
    const itens = Array.isArray(cliente.itens_pedido) ? cliente.itens_pedido : [];
    return cliente.etapa_atual !== 'MENU' || itens.length > 0 || !!cliente.produto_selecionado;
  }

  async marcarAvisoTimeout(cliente) {
    const [linhasAtualizadas] = await Cliente.update(
      { aviso_timeout_enviado: true },
      {
        where: {
          id: cliente.id,
          aviso_timeout_enviado: false,
          ultima_interacao: { [Op.ne]: null }
        }
      }
    );

    return linhasAtualizadas > 0;
  }

  async marcarAtendimentoEncerrado(cliente) {
    const [linhasAtualizadas] = await Cliente.update(
      {
        itens_pedido: [],
        produto_selecionado: null,
        etapa_atual: 'MENU',
        ultima_interacao: null,
        aviso_timeout_enviado: false
      },
      {
        where: {
          id: cliente.id,
          ultima_interacao: { [Op.ne]: null }
        }
      }
    );

    return linhasAtualizadas > 0;
  }
}

module.exports = new TimeoutService();
