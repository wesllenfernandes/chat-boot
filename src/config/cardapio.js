const Produto = require('../models/Produto');

const semente = [
  { id: 1, nome: 'Pizza Calabresa', preco: 30.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, calabresa fatiada, cebola e orégano' },
  { id: 2, nome: 'Pizza Frango', preco: 28.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, frango desfiado, catupiry e orégano' },
  { id: 3, nome: 'Pizza Margherita', preco: 26.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, mussarela, tomate fresco e manjericão' },
  { id: 4, nome: 'Pizza Portuguesa', preco: 32.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, mussarela, presunto, ovos, cebola e azeitona' },
  { id: 5, nome: 'Pizza Quatro Queijos', preco: 35.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, mussarela, provolone, parmesão e catupiry' },
  { id: 6, nome: 'Pizza Pepperoni', preco: 34.00, tipo: 'pizza', descricao: 'Pizza grande (8 fatias) - Molho de tomate, mussarela e pepperoni fatiado' },
  { id: 7, nome: 'Refrigerante', preco: 6.00, tipo: 'bebida', descricao: 'Lata 350ml - Coca-Cola, Guaraná Antarctica ou Fanta Laranja' },
  { id: 8, nome: 'Suco Natural', preco: 8.00, tipo: 'bebida', descricao: '500ml - Laranja, Limão, Maracujá ou Abacaxi' },
  { id: 9, nome: 'Água Mineral', preco: 4.00, tipo: 'bebida', descricao: 'Garrafa 500ml sem gás' },
  { id: 10, nome: 'Batata Frita', preco: 15.00, tipo: 'acompanhamento', descricao: 'Porção individual 200g, crocante e temperada' }
];

// Array em memória compartilhado — mutado no lugar para que todos os importadores vejam as atualizações
const cardapio = [];

async function inicializar() {
  const count = await Produto.count();
  if (count === 0) {
    await Produto.bulkCreate(semente);
  }
  await recarregar();
}

async function recarregar() {
  const produtos = await Produto.findAll({ where: { ativo: true }, order: [['id', 'ASC']] });
  cardapio.splice(0, cardapio.length, ...produtos.map(p => ({
    id: p.id,
    nome: p.nome,
    preco: parseFloat(p.preco),
    tipo: p.tipo,
    descricao: p.descricao || ''
  })));
}

const formatarCardapio = () => {
  let mensagem = '🍕 *CARDÁPIO DA PIZZARIA*\n\n';
  cardapio.forEach(item => {
    const emoji = item.tipo === 'pizza' ? '🍕' : item.tipo === 'bebida' ? '🥤' : '🍟';
    mensagem += `${item.id} - ${emoji} ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
  });
  mensagem += '\nDigite o número do produto que deseja pedir ou "menu" para ver o cardápio novamente.';
  return mensagem;
};

const buscarProduto = (id) => {
  return cardapio.find(item => item.id === parseInt(id));
};

module.exports = { cardapio, formatarCardapio, buscarProduto, inicializar, recarregar };
