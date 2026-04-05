const { formatarCardapio, buscarProduto } = require('../config/cardapio');
const ClienteService = require('./ClienteService');
const PedidoService = require('./PedidoService');
const AIService = require('./AIService');

class ChatbotService {
  static async processarMensagem(telefone, mensagem) {
    // Atualizar última interação
    await ClienteService.atualizarUltimaInteracao(telefone);
    
    // Normalizar mensagem
    const msg = mensagem.toLowerCase().trim();
    
    // Buscar ou criar cliente
    const cliente = await ClienteService.buscarOuCriar(telefone);
    const etapa = cliente.etapa_atual;
    
    // Comando para reiniciar
    if (msg === 'menu' || msg === 'reiniciar' || msg === 'cancelar') {
      await ClienteService.limparPedido(telefone);
      return {
        resposta: formatarCardapio(),
        proximaEtapa: 'MENU'
      };
    }
    
    // Processar de acordo com a etapa atual
    switch (etapa) {
      case 'MENU':
        return await this.processarMenu(telefone, msg, cliente, mensagem);
        
      case 'ESCOLHENDO_PRODUTO':
        return await this.processarEscolhaProduto(telefone, msg, cliente, mensagem);
        
      case 'QUANTIDADE':
        return await this.processarQuantidade(telefone, msg, cliente, mensagem);
        
      case 'PAGAMENTO':
        return await this.processarPagamento(telefone, msg, cliente, mensagem);
        
      case 'ENDERECO':
        return await this.processarEndereco(telefone, msg, cliente, mensagem);
        
      case 'CONFIRMACAO':
        return await this.processarConfirmacao(telefone, msg, cliente, mensagem);
        
      default:
        await ClienteService.resetarEtapa(telefone);
        return {
          resposta: formatarCardapio(),
          proximaEtapa: 'MENU'
        };
    }
  }
  
  static async processarMenu(telefone, msg, cliente, mensagem) {
    // Palavras que indicam pedidos em linguagem natural
    const indicadoresPedido = [
      'quero', 'gostaria', 'queria', 'preciso', 'vou levar',
      'me dê', 'me da', 'traga', 'quero pedir', 'gostaria de pedir'
    ];

    // Palavras que indicam intenção de finalizar
    const indicadoresFinalizar = [
      'finalizar', 'encerrar', 'fechar', 'só isso', 'só isso por enquanto',
      'está bom', 'está bom assim', 'não quero mais', 'não precisa de mais',
      'encerrar pedido', 'fechar pedido', 'finalizar pedido'
    ];

    // Comando para ver cardápio (mantido para facilitar)
    const comandosCardapio = ['cardapio', 'cardápio', 'menu', 'ver cardapio', 'ver cardápio'];

    // Verificar se há itens no carrinho
    const clienteAtualizado = await ClienteService.buscarOuCriar(telefone);
    const itens = clienteAtualizado.itens_pedido;

    // Se há itens no carrinho, verificar se o cliente quer adicionar mais ou finalizar
    if (itens.length > 0) {
      // Verificar se o cliente quer finalizar em linguagem natural
      if (indicadoresFinalizar.some(indicador => msg.includes(indicador))) {
        console.log('🔄 Cliente quer finalizar pedido (linguagem natural)');
        return await this.finalizarPedido(telefone);
      }

      // Verificar se o cliente quer ver o cardápio (adicionar mais)
      if (comandosCardapio.some(cmd => msg === cmd || msg.includes(cmd))) {
        console.log('📋 Cliente quer ver cardápio');
        return {
          resposta: formatarCardapio(),
          proximaEtapa: 'MENU'
        };
      }

      // Usar IA para interpretar a intenção (adicionar ou finalizar)
      try {
        console.log('🤖 Interpretando intenção do cliente com IA...');
        const interpretacao = await AIService.interpretarIntencao(mensagem, itens);

        console.log(`📊 Interpretação: ${JSON.stringify(interpretacao)}`);

        if (interpretacao.intencao === 'finalizar') {
          console.log('✅ IA detectou intenção de finalizar');
          return await this.finalizarPedido(telefone);
        }

        if (interpretacao.ePedido && interpretacao.produtos.length > 0) {
          console.log('✅ IA detectou pedido em linguagem natural');
          // Processar os produtos
          let primeiroItem = true;

          for (const produto of interpretacao.produtos) {
            const produtoDoCardapio = buscarProduto(produto.id);
            if (produtoDoCardapio) {
              if (primeiroItem) {
                await ClienteService.atualizarProdutoSelecionado(telefone, produtoDoCardapio);
                primeiroItem = false;
              }

              const item = {
                produto: produtoDoCardapio.nome,
                quantidade: produto.quantidade,
                preco: produtoDoCardapio.preco
              };

              await ClienteService.adicionarItemAoPedido(telefone, item);
            }
          }

          // Atualizar e mostrar itens atualizados
          const clienteAtualizado2 = await ClienteService.buscarOuCriar(telefone);
          const itensAtualizados = clienteAtualizado2.itens_pedido;

          let resposta = 'Excelente escolha! ✅\n\n';
          itensAtualizados.forEach(item => {
            resposta += `${item.quantidade}x ${item.produto}\n`;
          });
          resposta += '\nGostaria de adicionar mais itens ao pedido ou deseja finalizar?';

          return {
            resposta: resposta,
            proximaEtapa: 'MENU'
          };
        }

        if (interpretacao.intencao === 'adicionar') {
          console.log('✅ IA detectou intenção de adicionar itens');
          return {
            resposta: formatarCardapio(),
            proximaEtapa: 'MENU'
          };
        }
      } catch (error) {
        console.error('Erro ao interpretar intenção:', error);
      }
    }

    // Verificar se quer ver o cardápio
    if (comandosCardapio.some(cmd => msg === cmd || msg.includes(cmd))) {
      return {
        resposta: formatarCardapio(),
        proximaEtapa: 'MENU'
      };
    }

    // Comando "finalizar"
    if (msg === 'finalizar' || msg === 'finalizar pedido' || msg === 'concluir') {
      return await this.finalizarPedido(telefone);
    }

    // Se for um número válido do cardápio (mantido para facilitar)
    const produtoId = parseInt(msg);
    const produto = buscarProduto(produtoId);

    if (produto) {
      await ClienteService.atualizarProdutoSelecionado(telefone, produto);
      await ClienteService.atualizarEtapa(telefone, 'QUANTIDADE');

      return {
        resposta: `Perfeito! 🍕 Você escolheu: *${produto.nome}* por R$ ${produto.preco.toFixed(2)}

Quantas unidades você gostaria de levar?`,
        proximaEtapa: 'QUANTIDADE'
      };
    }

    // Se for um pedido em linguagem natural, processar com IA
    if (indicadoresPedido.some(indicador => msg.includes(indicador))) {
      try {
        const interpretacao = await AIService.interpretarPedido(mensagem);

        if (interpretacao.ePedido && interpretacao.produtos.length > 0) {
          let primeiroItem = true;

          for (const produto of interpretacao.produtos) {
            const produtoDoCardapio = buscarProduto(produto.id);
            if (produtoDoCardapio) {
              if (primeiroItem) {
                await ClienteService.atualizarProdutoSelecionado(telefone, produtoDoCardapio);
                primeiroItem = false;
              }

              const item = {
                produto: produtoDoCardapio.nome,
                quantidade: produto.quantidade,
                preco: produtoDoCardapio.preco
              };

              await ClienteService.adicionarItemAoPedido(telefone, item);
            }
          }
        }

        // Atualizar cliente para pegar os itens atualizados
        const clienteAtualizado3 = await ClienteService.buscarOuCriar(telefone);
        const itensAtualizados3 = clienteAtualizado3.itens_pedido;

        if (itensAtualizados3.length > 0) {
          // Se adicionou itens ao pedido
          await ClienteService.atualizarEtapa(telefone, 'MENU');

          let resposta = 'Excelente escolha! ✅\n\n';
          itensAtualizados3.forEach(item => {
            resposta += `${item.quantidade}x ${item.produto}\n`;
          });
          resposta += '\nGostaria de adicionar mais itens ao pedido ou deseja finalizar?';

          return {
            resposta: resposta,
            proximaEtapa: 'MENU'
          };
        }
      } catch (error) {
        console.error('Erro ao interpretar pedido:', error);
      }
    }

    // Para todas as outras mensagens (saudações, perguntas, etc.), usar IA como atendente principal
    try {
      console.log('🤖 Usando IA como atendente principal');
      console.log(`📩 Mensagem original: "${mensagem}"`);
      const respostaIA = await AIService.gerarResposta(mensagem);
      console.log(`✅ Resposta da IA recebida: "${respostaIA.substring(0, 50)}..."`);
      return {
        resposta: respostaIA,
        proximaEtapa: 'MENU'
      };
    } catch (error) {
      console.error('Erro ao usar IA:', error);
      console.error('Detalhes do erro:', error.message);
      console.error('Stack:', error.stack);
      return {
        resposta: 'Desculpe, não entendi sua mensagem. 😕\n\nVocê pode:\n• Digitar o número do produto\n• Descrever o que deseja\n• Dizer "cardápio" para ver as opções',
        proximaEtapa: 'MENU'
      };
    }
  }
  
  static async processarEscolhaProduto(telefone, msg, cliente, mensagem) {
    // Esta etapa não é mais utilizada, mas mantida para compatibilidade
    return await this.processarMenu(telefone, msg, cliente, mensagem);
  }
  
  static async processarQuantidade(telefone, msg, cliente, mensagem) {
    const quantidade = parseInt(msg);

    if (isNaN(quantidade) || quantidade < 1) {
      return {
        resposta: 'Por favor, digite uma quantidade válida (número maior que 0). 😊',
        proximaEtapa: 'QUANTIDADE'
      };
    }

    const produto = cliente.produto_selecionado;
    const item = {
      produto: produto.nome,
      quantidade: quantidade,
      preco: produto.preco
    };

    await ClienteService.adicionarItemAoPedido(telefone, item);

    // Atualizar cliente para pegar os itens atualizados
    const clienteAtualizado = await ClienteService.buscarOuCriar(telefone);
    const itens = clienteAtualizado.itens_pedido;

    // Perguntar se deseja adicionar mais itens
    await ClienteService.atualizarEtapa(telefone, 'MENU');

    let resposta = `✅ Perfeito! Adicionamos ${quantidade}x ${produto.nome} ao seu pedido.\n\n`;

    if (itens.length > 1) {
      resposta += 'Seu pedido atual:\n';
      itens.forEach(item => {
        resposta += `• ${item.quantidade}x ${item.produto}\n`;
      });
      resposta += '\n';
    }

    resposta += 'Gostaria de adicionar mais itens ou deseja finalizar o pedido?';

    return {
      resposta: resposta,
      proximaEtapa: 'MENU'
    };
  }
  
  static async processarPagamento(telefone, msg, cliente, mensagem) {
    const opcao = parseInt(msg);

    // Mapeamento de opções para formas de pagamento
    const formasPagamento = {
      1: 'Dinheiro',
      2: 'Pix',
      3: 'Cartão'
    };

    const formaPagamento = formasPagamento[opcao];

    if (!formaPagamento) {
      return {
        resposta: 'Opção inválida. 😕\n\nPor favor, escolha uma das opções:\n\n1 - Dinheiro\n2 - Pix\n3 - Cartão',
        proximaEtapa: 'PAGAMENTO'
      };
    }

    // Salvar forma de pagamento no cliente (usando produto_selecionado temporariamente)
    await ClienteService.atualizarProdutoSelecionado(telefone, { ...cliente.produto_selecionado, formaPagamento });
    await ClienteService.atualizarEtapa(telefone, 'ENDERECO');

    return {
      resposta: `✅ ${formaPagamento}! Perfeito. 📍\n\nAgora, por favor, digite seu endereço completo para entrega:`,
      proximaEtapa: 'ENDERECO'
    };
  }
  
  static async processarEndereco(telefone, msg, cliente, mensagem) {
    if (msg.length < 5) {
      return {
        resposta: 'Endereço muito curto. 😕 Por favor, digite seu endereço completo com rua, número e bairro.',
        proximaEtapa: 'ENDERECO'
      };
    }

    const endereco = msg;

    // Salvar endereço no cliente (usando produto_selecionado temporariamente)
    await ClienteService.atualizarProdutoSelecionado(telefone, {
      ...cliente.produto_selecionado,
      endereco
    });
    await ClienteService.atualizarEtapa(telefone, 'CONFIRMACAO');

    // Calcular total e formatar resumo
    const itens = cliente.itens_pedido;
    const total = PedidoService.calcularTotal(itens);
    const formaPagamento = cliente.produto_selecionado.formaPagamento;

    const resumo = PedidoService.formatarResumoPedido(itens, total, formaPagamento, endereco);

    return {
      resposta: resumo + '\n\nEstá tudo correto? Digite "sim" para confirmar ou "não" para cancelar.',
      proximaEtapa: 'CONFIRMACAO'
    };
  }
  
  static async processarConfirmacao(telefone, msg, cliente, mensagem) {
    const resposta = msg.toLowerCase();

    if (resposta === 'sim' || resposta === 's' || resposta === 'confirmar' || resposta === 'ok') {
      try {
        // Recuperar dados do pedido
        const itens = cliente.itens_pedido;
        const total = PedidoService.calcularTotal(itens);
        const formaPagamento = cliente.produto_selecionado.formaPagamento;
        const endereco = cliente.produto_selecionado.endereco;

        // Criar pedido no banco
        const pedido = await PedidoService.criarPedido(
          cliente.id,
          total,
          formaPagamento,
          endereco,
          itens
        );

        // Limpar dados do cliente
        await ClienteService.limparPedido(telefone);

        return {
          resposta: `🎉 *PEDIDO CONFIRMADO!*\n\n🆔 Número do Pedido: #${pedido.id}\n💰 Total: R$ ${total.toFixed(2)}\n💳 Pagamento: ${formaPagamento}\n📍 Endereço: ${endereco}\n\n⏱️ Tempo estimado de entrega: 40-50 minutos\n\nObrigado pela preferência! 🍕`,
          proximaEtapa: 'MENU'
        };
      } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return {
          resposta: 'Ocorreu um erro ao confirmar seu pedido. 😕 Por favor, tente novamente.',
          proximaEtapa: 'CONFIRMACAO'
        };
      }
    } else if (resposta === 'não' || resposta === 'nao' || resposta === 'n' || resposta === 'cancelar') {
      await ClienteService.limparPedido(telefone);

      return {
        resposta: 'Pedido cancelado. 😊\n\nSe quiser fazer um novo pedido, é só me avisar!',
        proximaEtapa: 'MENU'
      };
    } else {
      return {
        resposta: 'Não entendi sua resposta. 😕\n\nPor favor, digite "sim" para confirmar ou "não" para cancelar.',
        proximaEtapa: 'CONFIRMACAO'
      };
    }
  }
  
  static async finalizarPedido(telefone) {
    const cliente = await ClienteService.buscarOuCriar(telefone);
    const itens = cliente.itens_pedido;

    if (itens.length === 0) {
      return {
        resposta: 'Você ainda não adicionou nenhum item ao seu pedido. 😊\n\nGostaria de ver o cardápio ou precisa de ajuda para escolher?',
        proximaEtapa: 'MENU'
      };
    }

    await ClienteService.atualizarEtapa(telefone, 'PAGAMENTO');

    let resposta = 'Ótimo! Vamos finalizar seu pedido. 💳\n\n';
    resposta += 'Seu pedido:\n';
    itens.forEach(item => {
      resposta += `• ${item.quantidade}x ${item.produto}\n`;
    });

    resposta += '\nQual forma de pagamento você prefere?\n';
    resposta += '1 - Dinheiro\n';
    resposta += '2 - Pix\n';
    resposta += '3 - Cartão\n\n';
    resposta += 'Digite apenas o número da opção:';

    return {
      resposta: resposta,
      proximaEtapa: 'PAGAMENTO'
    };
  }
}

module.exports = ChatbotService;