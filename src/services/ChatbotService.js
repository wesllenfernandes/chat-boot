const { formatarCardapio, buscarProduto } = require('../config/cardapio');
const ClienteService = require('./ClienteService');
const PedidoService = require('./PedidoService');

class ChatbotService {
  static async processarMensagem(telefone, mensagem) {
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
        return await this.processarMenu(telefone, msg, cliente);
        
      case 'ESCOLHENDO_PRODUTO':
        return await this.processarEscolhaProduto(telefone, msg, cliente);
        
      case 'QUANTIDADE':
        return await this.processarQuantidade(telefone, msg, cliente);
        
      case 'PAGAMENTO':
        return await this.processarPagamento(telefone, msg, cliente);
        
      case 'ENDERECO':
        return await this.processarEndereco(telefone, msg, cliente);
        
      case 'CONFIRMACAO':
        return await this.processarConfirmacao(telefone, msg, cliente);
        
      default:
        await ClienteService.resetarEtapa(telefone);
        return {
          resposta: formatarCardapio(),
          proximaEtapa: 'MENU'
        };
    }
  }
  
  static async processarMenu(telefone, msg, cliente) {
    // Lista de saudações e palavras de ativação
    const ativacoes = [
      'oi', 'olá', 'ola', 'oie',
      'bom dia', 'bomdia', 'boa dia', 'boadia',
      'boa tarde', 'boatarde', 'boa tarde', 'boatarde',
      'boa noite', 'boanoite',
      'hey', 'ei', 'eai', 'eai',
      'salve', 'salve salve', 'opa',
      'fala', 'fala galera',
      'e ai', 'eae',
      'cardapio', 'cardápio', 'menu',
      'pedido', 'pedir',
      'quero', 'gostaria',
      'inicio', 'iniciar', 'start',
      'ajuda', 'help', 'socorro'
    ];
    
    // Verificar se é uma mensagem de ativação/saudação
    if (ativacoes.some(ativacao => msg.includes(ativacao) || msg === ativacao)) {
      const saudacoes = {
        'oi': 'Olá! 👋',
        'olá': 'Olá! 👋',
        'ola': 'Olá! 👋',
        'oie': 'Oiê! 👋',
        'bom dia': 'Bom dia! ☀️',
        'bomdia': 'Bom dia! ☀️',
        'boa dia': 'Bom dia! ☀️',
        'boadia': 'Bom dia! ☀️',
        'boa tarde': 'Boa tarde! 🌤️',
        'boatarde': 'Boa tarde! 🌤️',
        'boa noite': 'Boa noite! 🌙',
        'boanoite': 'Boa noite! 🌙',
        'hey': 'Hey! 👋',
        'ei': 'Ei! 👋',
        'eai': 'E aí! 👋',
        'eae': 'E aí! 👋',
        'salve': 'Salve! ✌️',
        'salve salve': 'Salve salve! ✌️',
        'opa': 'Opa! 👋',
        'fala': 'Fala! 👋',
        'fala galera': 'Fala galera! 👋',
        'e ai': 'E aí! 👋',
        'cardapio': '🍕',
        'cardápio': '🍕',
        'menu': '🍕',
        'pedido': '🍕',
        'pedir': '🍕',
        'quero': '🍕',
        'gostaria': '🍕',
        'inicio': '🍕',
        'iniciar': '🍕',
        'start': '🍕',
        'ajuda': '🍕',
        'help': '🍕',
        'socorro': '🍕'
      };
      
      // Encontrar saudação correspondente
      let saudacao = '🍕';
      for (const [key, value] of Object.entries(saudacoes)) {
        if (msg.includes(key) || msg === key) {
          saudacao = value;
          break;
        }
      }
      
      return {
        resposta: `${saudacao} Bem-vindo à *Pizzaria*! 🍕\n\n${formatarCardapio()}`,
        proximaEtapa: 'MENU'
      };
    }
    
    // Verificar comando "finalizar"
    if (msg === 'finalizar' || msg === 'finalizar pedido' || msg === 'concluir') {
      return await this.finalizarPedido(telefone);
    }
    
    // Se for um número válido do cardápio
    const produtoId = parseInt(msg);
    const produto = buscarProduto(produtoId);
    
    if (produto) {
      await ClienteService.atualizarProdutoSelecionado(telefone, produto);
      await ClienteService.atualizarEtapa(telefone, 'QUANTIDADE');
      
      return {
        resposta: `✅ Você escolheu: *${produto.nome}*\n\nQual a quantidade que deseja?`,
        proximaEtapa: 'QUANTIDADE'
      };
    }
    
    // Se não for um número válido, mostrar cardápio novamente
    return {
      resposta: '❌ Opção inválida!\n\n' + formatarCardapio(),
      proximaEtapa: 'MENU'
    };
  }
  
  static async processarEscolhaProduto(telefone, msg, cliente) {
    // Esta etapa não é mais utilizada, mas mantida para compatibilidade
    return await this.processarMenu(telefone, msg, cliente);
  }
  
  static async processarQuantidade(telefone, msg, cliente) {
    const quantidade = parseInt(msg);
    
    if (isNaN(quantidade) || quantidade < 1) {
      return {
        resposta: '❌ Por favor, digite uma quantidade válida (número maior que 0).',
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
    
    return {
      resposta: `✅ Adicionado: ${quantidade}x ${produto.nome}\n\nDeseja adicionar mais itens?\n\nDigite o número de outro produto ou "finalizar" para continuar com o pagamento.`,
      proximaEtapa: 'MENU'
    };
  }
  
  static async processarPagamento(telefone, msg, cliente) {
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
        resposta: '❌ Opção inválida!\n\nPor favor, digite apenas o número:\n\n1 - Dinheiro\n2 - Pix\n3 - Cartão',
        proximaEtapa: 'PAGAMENTO'
      };
    }
    
    // Salvar forma de pagamento no cliente (usando produto_selecionado temporariamente)
    await ClienteService.atualizarProdutoSelecionado(telefone, { ...cliente.produto_selecionado, formaPagamento });
    await ClienteService.atualizarEtapa(telefone, 'ENDERECO');
    
    return {
      resposta: '✅ Forma de pagamento selecionada: *' + formaPagamento + '*\n\n📍 Por favor, digite seu endereço completo para entrega:',
      proximaEtapa: 'ENDERECO'
    };
  }
  
  static async processarEndereco(telefone, msg, cliente) {
    if (msg.length < 5) {
      return {
        resposta: '❌ Endereço muito curto! Por favor, digite seu endereço completo.',
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
      resposta: resumo,
      proximaEtapa: 'CONFIRMACAO'
    };
  }
  
  static async processarConfirmacao(telefone, msg, cliente) {
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
          resposta: `✅ *PEDIDO CONFIRMADO!*\n\n🆔 Número do Pedido: #${pedido.id}\n💰 Total: R$ ${total.toFixed(2)}\n💳 Pagamento: ${formaPagamento}\n📍 Endereço: ${endereco}\n\n⏱️ Tempo estimado de entrega: 40-50 minutos\n\nObrigado pela preferência! 🍕`,
          proximaEtapa: 'MENU'
        };
      } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return {
          resposta: '❌ Ocorreu um erro ao confirmar seu pedido. Por favor, tente novamente ou entre em contato pelo telefone.',
          proximaEtapa: 'CONFIRMACAO'
        };
      }
    } else if (resposta === 'não' || resposta === 'nao' || resposta === 'n' || resposta === 'cancelar') {
      await ClienteService.limparPedido(telefone);
      
      return {
        resposta: '❌ Pedido cancelado.\n\n' + formatarCardapio(),
        proximaEtapa: 'MENU'
      };
    } else {
      return {
        resposta: '❌ Resposta inválida!\n\nPor favor, digite "sim" para confirmar ou "não" para cancelar.',
        proximaEtapa: 'CONFIRMACAO'
      };
    }
  }
  
  static async finalizarPedido(telefone) {
    const cliente = await ClienteService.buscarOuCriar(telefone);
    const itens = cliente.itens_pedido;
    
    if (itens.length === 0) {
      return {
        resposta: '❌ Você não tem itens no carrinho!\n\n' + formatarCardapio(),
        proximaEtapa: 'MENU'
      };
    }
    
    await ClienteService.atualizarEtapa(telefone, 'PAGAMENTO');
    
    return {
      resposta: '💳 Escolha a forma de pagamento:\n\n1 - Dinheiro\n2 - Pix\n3 - Cartão\n\nDigite apenas o número da opção desejada:',
      proximaEtapa: 'PAGAMENTO'
    };
  }
}

module.exports = ChatbotService;
