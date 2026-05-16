const { cardapio, formatarCardapio, buscarProduto } = require('../config/cardapio');
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
    
    // Cancelamento em qualquer etapa
    if (this.isCancelamento(msg)) {
      const temItens = cliente.itens_pedido && cliente.itens_pedido.length > 0;
      await ClienteService.limparPedido(telefone);
      return {
        resposta: temItens
          ? '❌ *Pedido cancelado!*\n\nSeu pedido foi cancelado com sucesso. Se quiser fazer um novo pedido, é só escolher um item abaixo:\n\n' + formatarCardapio()
          : '✅ Tudo certo! Se quiser fazer um pedido, é só escolher:\n\n' + formatarCardapio(),
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

    if (itens.length > 0 && indicadoresFinalizar.some(indicador => msg.includes(indicador))) {
      console.log('Cliente quer finalizar pedido');
      return await this.finalizarPedido(telefone);
    }

    const produtoSelecionadoPorNumero = this.obterProdutoPorNumero(msg);
    if (produtoSelecionadoPorNumero) {
      return await this.selecionarProduto(telefone, produtoSelecionadoPorNumero);
    }

    const produtosDetectados = this.extrairProdutosDaMensagem(mensagem);
    if (produtosDetectados.length > 0) {
      return await this.adicionarProdutosAoPedido(telefone, produtosDetectados);
    }

    if (this.isPedidoGenerico(mensagem)) {
      return this.responderPedidoGenerico();
    }

    // Se há itens no carrinho, verificar se o cliente quer adicionar mais ou finalizar
    if (itens.length > 0) {
      // Verificar se o cliente quer finalizar em linguagem natural
      if (this.isRespostaNegativa(msg) || indicadoresFinalizar.some(indicador => msg.includes(indicador))) {
        console.log('🔄 Cliente quer finalizar pedido (linguagem natural)');
        return await this.finalizarPedido(telefone);
      }

      // Verificar se o cliente quer ver o cardápio (adicionar mais)
      if (this.isRespostaAfirmativa(msg)) {
        return {
          resposta: formatarCardapio(),
          proximaEtapa: 'MENU'
        };
      }

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

        if (interpretacao.produtos.length > 0) {
          return await this.adicionarProdutosAoPedido(telefone, interpretacao.produtos);
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
    if (this.isSaudacao(msg)) {
      return {
        resposta: this.responderSaudacao(msg),
        proximaEtapa: 'MENU'
      };
    }

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

        if (interpretacao.produtos && interpretacao.produtos.length > 0) {
          const produtosConfiaveis = this.filtrarProdutosExplicitamenteMencionados(mensagem, interpretacao.produtos);

          if (produtosConfiaveis.length > 0) {
            return await this.adicionarProdutosAoPedido(telefone, produtosConfiaveis);
          }

          console.log('IA sugeriu produto sem mencao explicita; pedindo escolha ao cliente');
          return this.responderPedidoGenerico();
        }

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
    const formaPagamento = this.resolverFormaPagamento(msg);

    if (!formaPagamento) {
      return {
        resposta: 'Não consegui identificar a forma de pagamento.\n\nEscolha uma opção:\n\n1 - Dinheiro\n2 - Pix\n3 - Cartão',
        proximaEtapa: 'PAGAMENTO'
      };
    }

    await ClienteService.atualizarProdutoSelecionado(telefone, { ...cliente.produto_selecionado, formaPagamento });
    await ClienteService.atualizarEtapa(telefone, 'ENDERECO');

    return {
      resposta: `✅ ${formaPagamento}! Perfeito.\n\nAgora, por favor, digite seu endereço completo para entrega:`,
      proximaEtapa: 'ENDERECO'
    };

    // Mapeamento de opções para formas de pagamento
    const formasPagamentoIgnoradas = {
      1: 'Dinheiro',
      2: 'Pix',
      3: 'Cartão'
    };

    void formasPagamentoIgnoradas;

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
    const resposta = this.normalizarTexto(msg);

    if (this.isRespostaNegativa(resposta) || resposta === 'cancelar') {
      await ClienteService.limparPedido(telefone);

      return {
        resposta: 'Pedido cancelado. 😊\n\nSe quiser fazer um novo pedido, é só me avisar!',
        proximaEtapa: 'MENU'
      };
    }

    if (this.isRespostaAfirmativa(resposta)) {
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
  
  static isCancelamento(msg) {
    const termos = [
      'cancelar', 'cancelar pedido', 'cancela', 'cancela pedido',
      'quero cancelar', 'desistir', 'desisti', 'desisto',
      'nao quero mais', 'nao quero fazer pedido',
      'esquece', 'esquece o pedido', 'esquecer',
      'reiniciar', 'recomecar', 'comecar de novo', 'menu'
    ];
    return termos.some(t => msg === t || msg.startsWith(t + ' ') || msg.endsWith(' ' + t));
  }

  static isPedidoGenerico(mensagem) {
    const texto = this.normalizarTexto(mensagem);
    const verbosPedido = ['quero', 'gostaria', 'queria', 'preciso', 'vou levar', 'me da', 'me de', 'pedir'];
    const tiposGenericos = ['pizza', 'pizzas', 'bebida', 'bebidas', 'refeicao', 'lanche'];

    return verbosPedido.some(verbo => texto.includes(verbo)) &&
      tiposGenericos.some(tipo => this.contemTermo(texto, tipo));
  }

  static isRespostaAfirmativa(mensagem) {
    const texto = this.normalizarTexto(mensagem);
    return texto === 's' ||
      texto === 'ss' ||
      texto === 'sim' ||
      texto.startsWith('sim ') ||
      texto === 'ok' ||
      texto === 'okay' ||
      texto === 'confirmar' ||
      texto === 'confirmo' ||
      texto === 'certo' ||
      texto === 'isso' ||
      texto === 'claro' ||
      texto === 'pode' ||
      texto.includes('ta certo') ||
      texto.includes('esta certo');
  }

  static isRespostaNegativa(mensagem) {
    const texto = this.normalizarTexto(mensagem);
    return texto === 'n' ||
      texto === 'nao' ||
      texto === 'n o' ||
      texto.startsWith('nao ') ||
      texto.startsWith('n o ') ||
      texto === 'negativo' ||
      texto.includes('nao quero') ||
      texto.includes('n o quero') ||
      texto.includes('nao quiser') ||
      texto.includes('quero cancelar') ||
      texto.includes('cancelar pedido');
  }

  static resolverFormaPagamento(mensagem) {
    const texto = this.normalizarTexto(mensagem);

    if (texto === '1' || texto.includes('dinheiro') || texto.includes('especie')) {
      return 'Dinheiro';
    }

    if (texto === '2' || texto.includes('pix')) {
      return 'Pix';
    }

    if (texto === '3' ||
      texto.includes('cartao') ||
      texto.includes('cart o') ||
      texto.includes('credito') ||
      texto.includes('debito')) {
      return 'Cartão';
    }

    return null;
  }

  static isSaudacao(mensagem) {
    const texto = this.normalizarTexto(mensagem);
    return [
      'oi',
      'ola',
      'oie',
      'bom dia',
      'boa tarde',
      'boa noite',
      'eai',
      'eae',
      'opa',
      'salve'
    ].includes(texto);
  }

  static responderSaudacao(mensagem) {
    const texto = this.normalizarTexto(mensagem);

    if (texto === 'bom dia') {
      return 'Bom dia! Bem-vindo à Pizzaria Otaliva. Como posso ajudar?';
    }

    if (texto === 'boa tarde') {
      return 'Boa tarde! Bem-vindo à Pizzaria Otaliva. Como posso ajudar?';
    }

    if (texto === 'boa noite') {
      return 'Boa noite! Bem-vindo à Pizzaria Otaliva. Como posso ajudar?';
    }

    return 'Olá! Bem-vindo à Pizzaria Otaliva. Como posso ajudar?';
  }

  static responderPedidoGenerico() {
    return {
      resposta: 'Claro! Qual item você gostaria?\n\n' + formatarCardapio(),
      proximaEtapa: 'MENU'
    };

    return {
      resposta: 'Claro! Qual item vocÃª gostaria?\n\n' + formatarCardapio(),
      proximaEtapa: 'MENU'
    };
  }

  static filtrarProdutosExplicitamenteMencionados(mensagem, produtos) {
    const texto = this.normalizarTexto(mensagem);

    return produtos.filter(produto => {
      const produtoDoCardapio = this.resolverProdutoDoCardapio(produto);
      if (!produtoDoCardapio) {
        return false;
      }

      return this.obterAliasesProduto(produtoDoCardapio)
        .some(alias => this.contemTermo(texto, alias));
    });
  }

  static obterProdutoPorNumero(msg) {
    if (!/^\d+$/.test(msg)) {
      return null;
    }

    return buscarProduto(parseInt(msg));
  }

  static async selecionarProduto(telefone, produto) {
    await ClienteService.atualizarProdutoSelecionado(telefone, produto);
    await ClienteService.atualizarEtapa(telefone, 'QUANTIDADE');

    return {
      resposta: `Perfeito! 🍕 Você escolheu: *${produto.nome}* por R$ ${produto.preco.toFixed(2)}

Quantas unidades você gostaria de levar?`,
      proximaEtapa: 'QUANTIDADE'
    };

    return {
      resposta: `Perfeito! ðŸ• VocÃª escolheu: *${produto.nome}* por R$ ${produto.preco.toFixed(2)}

Quantas unidades vocÃª gostaria de levar?`,
      proximaEtapa: 'QUANTIDADE'
    };
  }

  static async adicionarProdutosAoPedido(telefone, produtos) {
    let adicionouItem = false;

    for (const produto of produtos) {
      const produtoDoCardapio = this.resolverProdutoDoCardapio(produto);

      if (!produtoDoCardapio) {
        continue;
      }

      await ClienteService.adicionarItemAoPedido(telefone, {
        produto: produtoDoCardapio.nome,
        quantidade: this.normalizarQuantidade(produto.quantidade),
        preco: produtoDoCardapio.preco
      });
      adicionouItem = true;
    }

    if (!adicionouItem) {
      return {
        resposta: 'Não consegui identificar esse item no cardápio. Digite o número do produto ou escreva o nome, como "refrigerante" ou "pizza calabresa".',
        proximaEtapa: 'MENU'
      };

      return {
        resposta: 'NÃ£o consegui identificar esse item no cardÃ¡pio. Digite o nÃºmero do produto ou escreva o nome, como "refrigerante" ou "pizza calabresa".',
        proximaEtapa: 'MENU'
      };
    }

    await ClienteService.atualizarEtapa(telefone, 'MENU');
    const clienteAtualizado = await ClienteService.buscarOuCriar(telefone);
    return this.montarRespostaPedidoAtual(clienteAtualizado.itens_pedido);
  }

  static montarRespostaPedidoAtual(itens) {
    let respostaLimpa = 'Excelente escolha! ✅\n\n';
    itens.forEach(item => {
      respostaLimpa += `${item.quantidade}x ${item.produto}\n`;
    });
    respostaLimpa += '\nGostaria de adicionar mais itens ao pedido ou deseja finalizar?';

    return {
      resposta: respostaLimpa,
      proximaEtapa: 'MENU'
    };
    let resposta = 'Excelente escolha! âœ…\n\n';
    itens.forEach(item => {
      resposta += `${item.quantidade}x ${item.produto}\n`;
    });
    resposta += '\nGostaria de adicionar mais itens ao pedido ou deseja finalizar?';

    return {
      resposta,
      proximaEtapa: 'MENU'
    };
  }

  static extrairProdutosDaMensagem(mensagem) {
    const texto = this.normalizarTexto(mensagem);
    const produtos = [];

    for (const item of cardapio) {
      const aliases = this.obterAliasesProduto(item);

      if (aliases.some(alias => this.contemTermo(texto, alias))) {
        produtos.push({
          id: item.id,
          nome: item.nome,
          quantidade: this.extrairQuantidade(texto, aliases)
        });
      }
    }

    return produtos;
  }

  static resolverProdutoDoCardapio(produto) {
    const porNome = produto.nome ? this.buscarProdutoPorTexto(produto.nome) : null;
    if (porNome) {
      return porNome;
    }

    return buscarProduto(produto.id);
  }

  static buscarProdutoPorTexto(textoProduto) {
    const texto = this.normalizarTexto(textoProduto);

    return cardapio.find(item => {
      const aliases = this.obterAliasesProduto(item);
      return aliases.some(alias => this.contemTermo(texto, alias));
    });
  }

  static obterAliasesProduto(produto) {
    const nome = this.normalizarTexto(produto.nome);
    const aliasesPorId = {
      1: ['pizza calabresa', 'calabresa'],
      2: ['pizza frango', 'frango'],
      3: ['pizza margherita', 'margherita', 'marguerita'],
      4: ['pizza portuguesa', 'portuguesa'],
      5: ['pizza quatro queijos', 'quatro queijos', '4 queijos'],
      6: ['pizza pepperoni', 'pepperoni'],
      7: ['refrigerante', 'refri', 'refrigerantes', 'refresco', 'coca', 'coca cola', 'guarana', 'guarana antartica', 'fanta', 'sprite'],
      8: ['suco natural', 'suco'],
      9: ['agua mineral', 'agua'],
      10: ['batata frita', 'batata', 'fritas']
    };

    return [nome, ...(aliasesPorId[produto.id] || [])].map(alias => this.normalizarTexto(alias));
  }

  static contemTermo(texto, termo) {
    return new RegExp(`(^|\\s)${this.escaparRegex(termo)}(\\s|$)`).test(texto);
  }

  static extrairQuantidade(texto, aliases) {
    for (const alias of aliases) {
      const aliasRegex = this.escaparRegex(alias);
      const antesDoProduto = texto.match(new RegExp(`(?:^|\\s)(\\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\\s+${aliasRegex}(?:\\s|$)`));
      if (antesDoProduto) {
        return this.normalizarQuantidade(antesDoProduto[1]);
      }

      const depoisDoProduto = texto.match(new RegExp(`${aliasRegex}\\s+(\\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)(?:\\s|$)`));
      if (depoisDoProduto) {
        return this.normalizarQuantidade(depoisDoProduto[1]);
      }
    }

    return 1;
  }

  static normalizarQuantidade(quantidade) {
    if (!quantidade) {
      return 1;
    }

    if (typeof quantidade === 'number') {
      return quantidade > 0 ? quantidade : 1;
    }

    const texto = this.normalizarTexto(String(quantidade));
    const numerosPorExtenso = {
      um: 1,
      uma: 1,
      dois: 2,
      duas: 2,
      tres: 3,
      quatro: 4,
      cinco: 5,
      seis: 6,
      sete: 7,
      oito: 8,
      nove: 9,
      dez: 10
    };

    if (numerosPorExtenso[texto]) {
      return numerosPorExtenso[texto];
    }

    const numero = parseInt(texto);
    return !isNaN(numero) && numero > 0 ? numero : 1;
  }

  static normalizarTexto(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
