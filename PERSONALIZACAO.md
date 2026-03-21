# 🎨 Guia de Personalização

Este guia ajuda você a personalizar o chatbot da pizzaria conforme suas necessidades.

## 🍕 Personalizar Cardápio

### Localização
Arquivo: [`src/config/cardapio.js`](src/config/cardapio.js:1)

### Adicionar Novos Produtos

```javascript
const cardapio = [
  // ... produtos existentes ...
  
  // Adicione novos produtos aqui
  { id: 11, nome: 'Pizza Chocolate', preco: 40.00, tipo: 'doce' },
  { id: 12, nome: 'Pudim', preco: 12.00, tipo: 'sobremesa' },
  { id: 13, nome: 'Cerveja Lata', preco: 8.00, tipo: 'bebida' }
];
```

### Modificar Preços

```javascript
{ id: 1, nome: 'Pizza Calabresa', preco: 35.00, tipo: 'pizza' } // era 30.00
```

### Categorias Disponíveis

- `pizza` - 🍕 Pizzas
- `bebida` - 🥤 Bebidas
- `acompanhamento` - 🍟 Acompanhamentos
- `doce` - 🍰 Doces
- `sobremesa` - 🍮 Sobremesas

### Adicionar Nova Categoria

No arquivo [`src/config/cardapio.js`](src/config/cardapio.js:1), modifique a função `formatarCardapio`:

```javascript
const formatarCardapio = () => {
  let mensagem = '🍕 *CARDÁPIO DA PIZZARIA*\n\n';
  
  cardapio.forEach(item => {
    let emoji = '📦';
    if (item.tipo === 'pizza') emoji = '🍕';
    else if (item.tipo === 'bebida') emoji = '🥤';
    else if (item.tipo === 'acompanhamento') emoji = '🍟';
    else if (item.tipo === 'doce') emoji = '🍰';
    else if (item.tipo === 'sobremesa') emoji = '🍮';
    else if (item.tipo === 'minha_categoria') emoji = '🎯'; // sua categoria
    
    mensagem += `${item.id} - ${emoji} ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
  });
  
  return mensagem;
};
```

## 💬 Personalizar Mensagens do Bot

### Localização
Arquivo: [`src/services/ChatbotService.js`](src/services/ChatbotService.js:1)

### Mensagem de Boas-vindas

Modifique o método `processarMenu`:

```javascript
static async processarMenu(telefone, msg, cliente) {
  if (msg === 'oi' || msg === 'olá' || msg === 'ola') {
    return {
      resposta: '🍕 Olá! Bem-vindo à Pizzaria do João!\n\n' + formatarCardapio(),
      proximaEtapa: 'MENU'
    };
  }
  // ... resto do código
}
```

### Mensagem de Confirmação

Modifique o método `processarConfirmacao`:

```javascript
return {
  resposta: `✅ *PEDIDO CONFIRMADO!*\n\n` +
            `🆔 Número do Pedido: #${pedido.id}\n` +
            `💰 Total: R$ ${total.toFixed(2)}\n` +
            `💳 Pagamento: ${formaPagamento}\n` +
            `📍 Endereço: ${endereco}\n\n` +
            `⏱️ Tempo estimado: 40-50 minutos\n\n` +
            `🎉 Obrigado pela preferência! Volte sempre!\n` +
            `📞 Para dúvidas: (11) 99999-9999`,
  proximaEtapa: 'MENU'
};
```

## 🔧 Configurar Formas de Pagamento

### Localização
Arquivo: [`src/services/ChatbotService.js`](src/services/ChatbotService.js:1)

### Adicionar Nova Forma de Pagamento

No método `processarPagamento`:

```javascript
static async processarPagamento(telefone, msg, cliente) {
  const formasPagamento = {
    'dinheiro': 'Dinheiro',
    'pix': 'Pix',
    'cartão': 'Cartão',
    'cartao': 'Cartão',
    'vale': 'Vale Refeição',  // Nova forma
    'vr': 'Vale Refeição',
    'ticket': 'Ticket Restaurante'
  };
  
  // ... resto do código
}
```

E atualize o Model [`Pedido.js`](src/models/Pedido.js:1):

```javascript
forma_pagamento: {
  type: DataTypes.ENUM('Dinheiro', 'Pix', 'Cartão', 'Vale Refeição', 'Ticket Restaurante'),
  allowNull: false
}
```

## 📍 Personalizar Endereço

### Adicionar Campos de Endereço

No método `processarEndereco` do [`ChatbotService.js`](src/services/ChatbotService.js:1):

```javascript
static async processarEndereco(telefone, msg, cliente) {
  // Validação mais detalhada
  if (msg.length < 10) {
    return {
      resposta: '❌ Endereço muito curto! Por favor, inclua:\n' +
                '- Rua/Avenida\n' +
                '- Número\n' +
                '- Bairro\n' +
                '- Complemento (opcional)',
      proximaEtapa: 'ENDERECO'
    };
  }
  
  // ... resto do código
}
```

## 🎯 Adicionar Comandos Personalizados

### Comando de Promoção

No método `processarMensagem`:

```javascript
static async processarMensagem(telefone, mensagem) {
  const msg = mensagem.toLowerCase().trim();
  
  // Novo comando de promoção
  if (msg === 'promoção' || msg === 'promocao' || msg === 'promo') {
    return {
      resposta: '🔥 *PROMOÇÃO DO DIA!*\n\n' +
                '🍕 Pizza Grande + Refrigerante = R$ 35,00\n' +
                '⏰ Válido até às 20h\n\n' +
                'Digite o número do produto para aproveitar!',
      proximaEtapa: 'MENU'
    };
  }
  
  // ... resto do código
}
```

### Comando de Horário de Funcionamento

```javascript
if (msg === 'horário' || msg === 'horario' || msg === 'funcionamento') {
  return {
    resposta: '🕐 *HORÁRIO DE FUNCIONAMENTO*\n\n' +
              'Segunda a Quinta: 18h às 23h\n' +
              'Sexta e Sábado: 18h às 00h\n' +
              'Domingo: 18h às 22h\n\n' +
              '📞 Telefone: (11) 99999-9999',
    proximaEtapa: 'MENU'
  };
}
```

## 🎨 Personalizar Emojis e Formatação

### Cores e Formatação WhatsApp

Use estes formatos nas mensagens:

- `*texto*` - **Negrito**
- `_texto_` - *Itálico*
- `~texto~` - ~~Tachado~~
- ```texto``` - `Monospace`

### Exemplo com Emojis Personalizados

```javascript
return {
  resposta: '🍕🍕🍕\n' +
            '*PIZZARIA DO JOÃO*\n' +
            '🍕🍕🍕\n\n' +
            '✅ Pedido confirmado com sucesso!\n\n' +
            '💰 *Total:* R$ ' + total.toFixed(2) + '\n' +
            '💳 *Pagamento:* ' + formaPagamento + '\n' +
            '📍 *Endereço:* ' + endereco + '\n\n' +
            '⏱️ Tempo estimado: 40-50 minutos\n\n' +
            '🎉 Obrigado pela preferência!',
  proximaEtapa: 'MENU'
};
```

## 📊 Adicionar Estatísticas

### Rota de Estatísticas

No [`server.js`](server.js:1):

```javascript
app.get('/estatisticas', async (req, res) => {
  try {
    const { Pedido, Cliente } = require('./src/models');
    
    const totalPedidos = await Pedido.count();
    const totalClientes = await Cliente.count();
    const pedidosHoje = await Pedido.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0,0,0,0))
        }
      }
    });
    
    res.json({
      totalPedidos,
      totalClientes,
      pedidosHoje
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
```

## 🔔 Notificações

### Enviar Mensagem Proativa

No [`WhatsAppController.js`](src/controllers/WhatsAppController.js:1):

```javascript
async enviarPromocao(telefone) {
  const mensagem = '🔥 *PROMOÇÃO EXCLUSIVA!*\n\n' +
                   'Ganhe 10% de desconto no próximo pedido!\n' +
                   'Use o cupom: PIZZA10';
  
  await this.sendMessage(telefone, mensagem);
}
```

## 🌐 Configurar Multi-idioma

### Estrutura de Idiomas

Crie `src/config/idiomas.js`:

```javascript
const idiomas = {
  pt: {
    cardapio_titulo: 'CARDÁPIO DA PIZZARIA',
    pedido_confirmado: 'PEDIDO CONFIRMADO',
    total: 'Total'
  },
  en: {
    cardapio_titulo: 'PIZZERIA MENU',
    pedido_confirmado: 'ORDER CONFIRMED',
    total: 'Total'
  },
  es: {
    cardapio_titulo: 'MENÚ DE PIZZERÍA',
    pedido_confirmado: 'PEDIDO CONFIRMADO',
    total: 'Total'
  }
};

module.exports = idiomas;
```

---

**💡 Dica:** Sempre faça backup dos arquivos antes de modificar!

**🧪 Teste:** Após qualquer modificação, teste o fluxo completo para garantir que tudo funciona corretamente.
