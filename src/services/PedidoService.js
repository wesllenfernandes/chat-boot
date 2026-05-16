const { Pedido, ItemPedido, Cliente } = require('../models');

class PedidoService {
  static async criarPedido(clienteId, total, formaPagamento, endereco, itens, agendado = false, dataAgendamento = null, nomeDestinatario = null, cidade = null, taxaEntrega = 0) {
    const transaction = await Pedido.sequelize.transaction();

    try {
      const pedido = await Pedido.create({
        cliente_id: clienteId,
        total,
        forma_pagamento: formaPagamento,
        endereco,
        nome_destinatario: nomeDestinatario,
        cidade,
        taxa_entrega: taxaEntrega,
        status: 'confirmado',
        agendado,
        data_agendamento: dataAgendamento
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

  static formatarResumoPedido(itens, formaPagamento, endereco, nomeDestinatario = null, cidade = null, taxaEntrega = 0) {
    let mensagem = '📋 *RESUMO DO PEDIDO*\n\n';

    let subtotalItens = 0;
    itens.forEach((item, index) => {
      const sub = item.quantidade * Number(item.preco);
      subtotalItens += sub;
      mensagem += `${index + 1}. ${item.produto} x${item.quantidade} — R$ ${sub.toFixed(2)}\n`;
    });

    const grandTotal = subtotalItens + Number(taxaEntrega);

    if (taxaEntrega > 0) {
      mensagem += `\n💰 Subtotal: R$ ${subtotalItens.toFixed(2)}`;
      mensagem += `\n🚚 Taxa de entrega: R$ ${Number(taxaEntrega).toFixed(2)}`;
      mensagem += `\n💰 *Total: R$ ${grandTotal.toFixed(2)}*`;
    } else {
      mensagem += `\n🚚 Entrega gratuita`;
      mensagem += `\n💰 *Total: R$ ${grandTotal.toFixed(2)}*`;
    }

    mensagem += `\n💳 Pagamento: ${formaPagamento}`;
    if (nomeDestinatario) mensagem += `\n👤 Nome: ${nomeDestinatario}`;
    if (cidade) mensagem += `\n🌆 Cidade: ${cidade}`;
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
