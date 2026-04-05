# Exemplo de Conversa com o Chatbot

## 🍕 Comportamento Esperado

O chatbot agora funciona como um atendente de balcão real, mantendo contexto conversacional.

### 📝 Exemplo de Conversa

#### Início da Conversa
```
Cliente: Olá
Bot: Olá! 👋 Seja bem-vindo(a) à Pizzaria Otaliva 🍕

Em que posso te ajudar hoje?
• Fazer um pedido
• Ver o cardápio
• Tirar dúvidas

Digite sua mensagem ou "cardápio" para ver nossas opções!
```

#### Pedido em Linguagem Natural
```
Cliente: Quero uma pizza de frango
Bot: Excelente escolha! ✅

1x Pizza Frango

Gostaria de adicionar mais itens ao pedido ou deseja finalizar?
```

#### Adicionando Mais Itens
```
Cliente: Quero também um refrigerante
Bot: Excelente escolha! ✅

1x Pizza Frango
1x Refrigerante

Gostaria de adicionar mais itens ao pedido ou deseja finalizar?
```

#### Finalizando o Pedido
```
Cliente: finalizar
Bot: Ótimo! Vamos finalizar seu pedido. 💳

Seu pedido:
• 1x Pizza Frango
• 1x Refrigerante

Qual forma de pagamento você prefere?
1 - Dinheiro
2 - Pix
3 - Cartão

Digite apenas o número da opção:
```

#### Escolhendo Pagamento
```
Cliente: 2
Bot: ✅ Pix! Perfeito. 📍

Agora, por favor, digite seu endereço completo para entrega:
```

#### Informando Endereço
```
Cliente: Rua das Flores, 123, Centro
Bot: 📋 *RESUMO DO PEDIDO*

🍕 **Itens:**
• 1x Pizza Frango - R$ 28,00
• 1x Refrigerante - R$ 6,00

💰 **Total: R$ 34,00**
💳 **Pagamento:** Pix
📍 **Endereço:** Rua das Flores, 123, Centro

Está tudo correto? Digite "sim" para confirmar ou "não" para cancelar.
```

#### Confirmando
```
Cliente: sim
Bot: 🎉 *PEDIDO CONFIRMADO!*

🆔 Número do Pedido: #123
💰 Total: R$ 34,00
💳 Pagamento: Pix
📍 Endereço: Rua das Flores, 123, Centro

⏱️ Tempo estimado de entrega: 40-50 minutos

Obrigado pela preferência! 🍕
```

### ❓ Perguntas Frequentes

```
Cliente: Qual o horário de funcionamento?
Bot: Nossa pizzaria funciona de terça a domingo, das 18h às 23h! 🕐

Cliente: Vocês aceitam cartão?
Bot: Sim! Aceitamos cartão de crédito e débito, além de Pix e dinheiro. 💳

Cliente: Quanto custa a pizza de calabresa?
Bot: A pizza de calabresa é R$ 30,00! 🍕 É uma de nossas favoritas!

Cliente: Quais sabores de pizza vocês têm?
Bot: Temos vários sabores deliciosos! 🍕

Nossas pizzas:
• Pizza Calabresa - R$ 30,00
• Pizza Frango - R$ 28,00
• Pizza Margherita - R$ 26,00
• Pizza Portuguesa - R$ 32,00
• Pizza Quatro Queijos - R$ 35,00
• Pizza Pepperoni - R$ 34,00

Gostaria de fazer um pedido com algum destes sabores?
```

### 🎤 Mensagens de Áudio

```
[Cliente envia áudio dizendo "quero duas pizzas de calabresa"]
Bot: 🎤 Áudio transcrito: "quero duas pizzas de calabresa"
     Processando sua mensagem...

Bot: Excelente escolha! ✅

2x Pizza Calabresa

Gostaria de adicionar mais itens ao pedido ou deseja finalizar?
```

## 🎯 Principais Mudanças

### ✅ Saudações Naturais
- Responde de forma conversacional
- Pergunta como pode ajudar
- Não mostra o cardápio inteiro imediatamente

### ✅ Manutenção de Contexto
- Lembra itens do pedido atual
- Faz perguntas naturais
- Mantém conversação fluida

### ✅ Respostas da IA
- Respostas mais naturais e conversacionais
- Não repete o cardápio a cada mensagem
- Responde perguntas de forma direta

### ✅ Transcrição de Áudio
- Mensagens de áudio são transcritas automaticamente
- Transcrição é usada para processar o pedido

## 📊 Comparação: Antes x Depois

### Antes
```
Cliente: Olá
Bot: 🍕 Olá! Seja bem-vindo à Pizzaria Otaliva 🍕

[CARDAPIO COMPLETO - 30 linhas]

Cliente: Quero uma pizza de frango
Bot: ✅ Você escolheu: *Pizza Frango*

Qual a quantidade que deseja?

Cliente: 1
Bot: ✅ Adicionado: 1x Pizza Frango

Deseja adicionar mais itens?

Digite o número de outro produto ou "finalizar"...
```

### Depois
```
Cliente: Olá
Bot: Olá! 👋 Seja bem-vindo(a) à Pizzaria Otaliva 🍕

Em que posso te ajudar hoje?
• Fazer um pedido
• Ver o cardápio
• Tirar dúvidas

Digite sua mensagem ou "cardápio" para ver nossas opções!

Cliente: Quero uma pizza de frango
Bot: Excelente escolha! ✅

1x Pizza Frango

Gostaria de adicionar mais itens ao pedido ou deseja finalizar?
```

## 🚀 Como Testar

1. Inicie o servidor:
```bash
npm start
```

2. No WhatsApp:
- Digite "Olá" ou qualquer saudação
- Faça pedidos em linguagem natural
- Faça perguntas sobre a pizzaria
- Teste mensagens de áudio

3. Observe as respostas naturais e conversacionais

## 💡 Dicas para Melhores Conversas

- Use linguagem natural: "quero uma pizza", "quanto custa", etc.
- O chatbot manterá o contexto da conversa
- Para ver o cardápio completo, digite "cardápio"
- Para cancelar, digite "cancelar"
- Mensagens de áudio são transcritas automaticamente

---

**🍕 O chatbot agora atua como um atendente de balcão real!**