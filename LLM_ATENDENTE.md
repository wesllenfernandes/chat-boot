# 🤖 LLM como Atendente Principal

## ✅ Arquitetura Atual

A LLM (Ollama/llama3.2) agora é o **atendente principal** do chatbot, processando a maioria das mensagens.

### 📊 Fluxo de Decisão:

```
Mensagem do Cliente
        ↓
   ┌─────────────────┐
   │ É comando       │
   │ específico?      │
   └────┬────────────┘
        │
   SIM  │  NÃO
        ↓  ↓
   ┌───────┐  ┌─────────────────┐
   │Processa│  │  LLM (Ollama)  │
   │comando │  │  Atende e      │
   │direto  │  │  responde      │
   └───────┘  └─────────────────┘
```

### 🎯 O Que a LLM Faz:

A LLM agora responde **TODO** tipo de mensagem exceto comandos específicos:

1. ✅ **Saudações** ("Olá", "Bom dia", etc.)
2. ✅ **Perguntas** ("Qual o horário?", "Quanto custa?", etc.)
3. ✅ **Dúvidas** ("Vocês têm pizza vegetariana?", etc.)
4. ✅ **Pedidos** (interpretados quando usa "quero", "gostaria", etc.)
5. ✅ **Oferecer ajuda** de forma natural

### 🚫 Comandos Específicos (Hard-coded):

Estes são processados diretamente pelo código para garantir funcionalidade:

- **"menu", "reiniciar", "cancelar"** - Limpa o pedido atual
- **"cardápio", "cardapio"** - Mostra o cardápio completo
- **"finalizar"** - Inicia o processo de finalização
- **Números (1-10)** - Seleção rápida de produtos

## 📝 Exemplos de Uso

### 1. Saudações (LLM)

```
Cliente: Olá
LLM: Olá! 👋 Bem-vindo à Pizzaria Otaliva! 🍕

Em que posso te ajudar hoje?
• Fazer um pedido
• Ver o cardápio
• Tirar dúvidas

Digite sua mensagem ou "cardápio" para ver nossas opções!
```

### 2. Perguntas (LLM)

```
Cliente: Qual o horário de funcionamento?
LLM: Nossa pizzaria funciona de terça a domingo, das 18h às 23h! 🕐

Cliente: Quanto custa a pizza de calabresa?
LLM: A pizza de calabresa é R$ 30,00! 🍕 É uma de nossas favoritas!

Cliente: Vocês têm pizza vegetariana?
LLM: Sim! Temos a Pizza Vegetariana por R$ 38,00 🥗 É feita com legumes frescos e muito sabor!

Cliente: Quais formas de pagamento vocês aceitam?
LLM: Aceitamos várias formas de pagamento! 💳

• Dinheiro em espécie
• Pix
• Cartão de crédito
• Cartão de débito

Qualquer uma dessas opções é válida na hora do pagamento! 😊
```

### 3. Pedidos em Linguagem Natural (LLM)

```
Cliente: Quero fazer um pedido
LLM: Ótimo! Vamos fazer seu pedido! 🍕

Você pode fazer o pedido digitando o número do produto ou descrevendo o que deseja.
Digite "cardápio" para ver todas as opções!

Cliente: Quero duas pizzas de calabresa
LLM (interpretando pedido): Excelente escolha! ✅

2x Pizza Calabresa

Gostaria de adicionar mais itens ao pedido ou deseja finalizar?
```

### 4. Comandos Específicos (Hard-coded)

```
Cliente: cardápio
Bot: 🍕 *CARDÁPIO DA PIZZARIA*

1 - 🍕 Pizza Calabresa (R$ 30.00)
2 - 🍕 Pizza Frango (R$ 28.00)
...
[resto do cardápio]

Cliente: 1
Bot: Perfeito! 🍕 Você escolheu: *Pizza Calabresa* por R$ 30.00

Quantas unidades você gostaria de levar?

Cliente: 2
Bot: ✅ Perfeito! Adicionamos 2x Pizza Calabresa ao seu pedido.

Gostaria de adicionar mais itens ou deseja finalizar o pedido?

Cliente: finalizar
Bot: Ótimo! Vamos finalizar seu pedido. 💳

Seu pedido:
• 2x Pizza Calabresa

Qual forma de pagamento você prefere?
1 - Dinheiro
2 - Pix
3 - Cartão

Digite apenas o número da opção:
```

## 🎯 Prompt do Atendente (LLM)

O prompt do sistema define como a LLM se comporta:

```
Você é um atendente de balcão da Pizzaria Otaliva 🍕.

INFORMAÇÕES DA PIZZARIA:
- Nome: Pizzaria Otaliva
- Horário: Terça a domingo, 18h às 23h
- Pagamento: Dinheiro, Pix, Cartão
- Taxa de entrega: R$ 5,00
- Tempo: 40-50 minutos

[CARDÁPIO COMPLETO]

Sua função principal:
1. Responder saudações de forma natural e amigável
2. Responder perguntas sobre a pizzaria
3. Interpretar pedidos em linguagem natural
4. Ajudar o cliente a fazer pedidos
5. Oferecer o cardápio quando apropriado
```

## ✨ Vantagens da LLM como Atendente

### 1. Respostas Mais Naturais
- Saudações personalizadas
- Tom conversacional
- Emojis apropriados

### 2. Perguntas Ilimitadas
- Pode responder qualquer pergunta sobre a pizzaria
- Não precisa prever todas as perguntas
- Usa conhecimento do cardápio e informações

### 3. Manutenção Simplificada
- Adicionar nova informação? Atualize o prompt
- Mudar comportamento? Ajuste o prompt
- Não precisa de regras hard-coded

### 4. Escalabilidade
- Facilmente adicionar novos produtos
- Facilmente adicionar novas informações
- LLM se adapta automaticamente

## 🔄 Comparação: Antes x Depois

### Antes (Hard-coded)
```
Cliente: Olá
Bot: [Hard-coded: Olá + cardápio completo]

Cliente: Qual o horário?
Bot: [LLM: Horário de funcionamento]

Cliente: Quero uma pizza
Bot: [LLM: Interpreta pedido]
```

### Depois (LLM Principal)
```
Cliente: Olá
Bot: [LLM: Saudação personalizada + pergunta como ajudar]

Cliente: Qual o horário?
Bot: [LLM: Responde com informações da pizzaria]

Cliente: Quero uma pizza
Bot: [LLM: Interpreta pedido e adiciona ao carrinho]
```

## 🧪 Como Testar

1. **Saudações**
   - "Olá", "Bom dia", "Boa noite"
   - Deve responder de forma natural

2. **Perguntas**
   - "Qual o horário?"
   - "Quanto custa a pizza de calabresa?"
   - "Vocês têm pizza vegetariana?"
   - Deve responder com informações do prompt

3. **Pedidos**
   - "Quero fazer um pedido"
   - "Quero duas pizzas de calabresa"
   - Deve interpretar e processar

4. **Comandos específicos**
   - "cardápio" → Mostra cardápio completo
   - "1" → Seleciona pizza calabresa
   - "finalizar" → Finaliza pedido

## 💡 Melhorias Futuras

1. **Histórico de conversa** - Manter contexto entre mensagens
2. **Personalização** - Lembrar preferências do cliente
3. **Sugestões inteligentes** - LLM sugerir produtos baseados no contexto
4. **Mais informações** - Adicionar mais dados ao prompt (promoções, eventos, etc.)

## 📚 Documentação

- **OllamaService.js** - Prompt do atendente e implementação
- **ChatbotService.js** - Lógica de processamento de mensagens

---

**🤖 A LLM agora é o verdadeiro atendente de balcão da pizzaria!**