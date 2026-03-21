const { Pedido, ItemPedido, Cliente } = require('../models');

class PedidoService {
  static async criarPedido(clienteId, total, formaPagamento, endereco, itens) {
    const transaction = await Pedido.sequelize.transaction();
    
    try {
      // Criar o pedido
      const pedido = await Pedido.create({
        cliente_id: clienteId,
        total,
        forma_pagamento: formaPagamento,
        endereco,
        status: 'confirmado'
      }, { transaction });
      
      // Criar os itens do pedido
      for (const item of itens) {
        await ItemPedido.create({
          pedido_id: pedido.id,
          produto: item.produto,
          quantidade: item.quantidade,
          preco: item.preco
        }, { transaction });
      }
      
      await transaction.commit();
      return pedido;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async buscarPedidosPorCliente(clienteId) {
    return await Pedido.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: ItemPedido,
          as: 'itens'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  static async buscarPedidoPorId(pedidoId) {
    return await Pedido.findByPk(pedidoId, {
      include: [
        {
          model: ItemPedido,
          as: 'itens'
        }
      ]
    });
  }

  static async atualizarStatus(pedidoId, status) {
    await Pedido.update(
      { status },
      { where: { id: pedidoId } }
    );
  }

  static formatarResumoPedido(itens, total, formaPagamento, endereco) {
    let mensagem = '📋 *RESUMO DO PEDIDO*\n\n';
    
    itens.forEach((item, index) => {
      const subtotal = item.quantidade * item.preco;
      mensagem += `${index + 1}. ${item.produto} x${item.quantidade} - R$ ${subtotal.toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*`;
    mensagem += `\n💳 Forma de Pagamento: ${formaPagamento}`;
    mensagem += `\n📍 Endereço: ${endereco}`;
    mensagem += '\n\nConfirma o pedido? (sim/não)';
    
    return mensagem;
  }

  static calcularTotal(itens) {
    return itens.reduce((total, item) => {
      return total + (item.quantidade * item.preco);
    }, 0);
  }
}

module.exports = PedidoService;
