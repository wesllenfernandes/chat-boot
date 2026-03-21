const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');

// Definir relacionamentos
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

module.exports = {
  Cliente,
  Pedido,
  ItemPedido
};
