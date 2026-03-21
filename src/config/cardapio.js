// Cardápio da pizzaria
const cardapio = [
  { id: 1, nome: 'Pizza Calabresa', preco: 30.00, tipo: 'pizza' },
  { id: 2, nome: 'Pizza Frango', preco: 28.00, tipo: 'pizza' },
  { id: 3, nome: 'Pizza Margherita', preco: 26.00, tipo: 'pizza' },
  { id: 4, nome: 'Pizza Portuguesa', preco: 32.00, tipo: 'pizza' },
  { id: 5, nome: 'Pizza Quatro Queijos', preco: 35.00, tipo: 'pizza' },
  { id: 6, nome: 'Pizza Pepperoni', preco: 34.00, tipo: 'pizza' },
  { id: 7, nome: 'Refrigerante', preco: 6.00, tipo: 'bebida' },
  { id: 8, nome: 'Suco Natural', preco: 8.00, tipo: 'bebida' },
  { id: 9, nome: 'Água Mineral', preco: 4.00, tipo: 'bebida' },
  { id: 10, nome: 'Batata Frita', preco: 15.00, tipo: 'acompanhamento' }
];

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

module.exports = {
  cardapio,
  formatarCardapio,
  buscarProduto
};
