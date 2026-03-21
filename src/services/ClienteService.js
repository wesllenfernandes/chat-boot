const { Cliente } = require('../models');

class ClienteService {
  static async buscarOuCriar(telefone) {
    let cliente = await Cliente.findOne({ where: { telefone } });
    
    if (!cliente) {
      cliente = await Cliente.create({
        telefone,
        etapa_atual: 'MENU',
        itens_pedido: []
      });
    }
    
    return cliente;
  }

  static async atualizarEtapa(telefone, etapa) {
    await Cliente.update(
      { etapa_atual: etapa },
      { where: { telefone } }
    );
  }

  static async atualizarProdutoSelecionado(telefone, produto) {
    await Cliente.update(
      { produto_selecionado: produto },
      { where: { telefone } }
    );
  }

  static async adicionarItemAoPedido(telefone, item) {
    const cliente = await Cliente.findOne({ where: { telefone } });
    const itens = cliente.itens_pedido || [];
    itens.push(item);
    
    await Cliente.update(
      { itens_pedido: itens },
      { where: { telefone } }
    );
  }

  static async limparPedido(telefone) {
    await Cliente.update(
      { 
        itens_pedido: [],
        produto_selecionado: null,
        etapa_atual: 'MENU'
      },
      { where: { telefone } }
    );
  }

  static async resetarEtapa(telefone) {
    await Cliente.update(
      { etapa_atual: 'MENU' },
      { where: { telefone } }
    );
  }
}

module.exports = ClienteService;
