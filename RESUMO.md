# 🍕 Chatbot Pizzaria - Resumo Executivo

## 🎯 O que é?

Um chatbot automatizado de pedidos para pizzaria com integração ao WhatsApp, desenvolvido em Node.js com banco de dados SQLite.

## ✨ Funcionalidades Principais

- 📱 **Integração WhatsApp** - Atendimento 24/7 via WhatsApp
- 🍕 **Cardápio Digital** - Exibição interativa de produtos
- 🛒 **Carrinho de Compras** - Múltiplos itens por pedido
- 💰 **Cálculo Automático** - Total calculado automaticamente
- 💳 **Múltiplas Formas de Pagamento** - Dinheiro, Pix, Cartão
- 📍 **Entrega** - Registro de endereço
- ✅ **Confirmação** - Resumo antes de confirmar
- 💾 **Persistência** - Pedidos salvos no banco SQLite

## 🏗️ Arquitetura

```
WhatsApp → Controller → Service → Model → SQLite
```

### Camadas:
- **Controller**: [`WhatsAppController.js`](src/controllers/WhatsAppController.js:1) - Gerencia comunicação WhatsApp
- **Service**: [`ChatbotService.js`](src/services/ChatbotService.js:1) - Lógica do chatbot
- **Model**: [`Cliente.js`](src/models/Cliente.js:1), [`Pedido.js`](src/models/Pedido.js:1), [`ItemPedido.js`](src/models/ItemPedido.js:1) - Models Sequelize
- **Database**: SQLite em arquivo (database.sqlite)

## 🚀 Como Usar (2 Passos)

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Executar
```bash
npm start
```

Escaneie o QR Code no terminal com o WhatsApp do celular.

**Nota:** O banco de dados SQLite será criado automaticamente!

## 📊 Estrutura do Banco

```sql
clientes (id, telefone, etapa_atual, itens_pedido)
   ↓ 1:N
pedidos (id, cliente_id, total, forma_pagamento, endereco, status)
   ↓ 1:N
itens_pedido (id, pedido_id, produto, quantidade, preco)
```

## 💬 Fluxo de Conversação

```
Usuário: oi
Bot: [Cardápio]

Usuário: 1
Bot: Qual a quantidade?

Usuário: 2
Bot: Mais itens?

Usuário: finalizar
Bot: 💳 Escolha a forma de pagamento:
     1 - Dinheiro
     2 - Pix
     3 - Cartão

Usuário: 2
Bot: ✅ Forma de pagamento: Pix
     Digite o endereço

Usuário: Rua X, 123
Bot: [Resumo] Confirma?

Usuário: sim
Bot: ✅ Pedido confirmado!
```

## 📁 Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| [`server.js`](server.js:1) | Ponto de entrada |
| [`src/config/cardapio.js`](src/config/cardapio.js:1) | Cardápio da pizzaria |
| [`src/services/ChatbotService.js`](src/services/ChatbotService.js:1) | Lógica do chatbot |
| [`src/controllers/WhatsAppController.js`](src/controllers/WhatsAppController.js:1) | Controle WhatsApp |

## 🔧 Tecnologias

- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Sequelize
- **Banco**: SQLite (arquivo único)
- **WhatsApp**: whatsapp-web.js

## 📚 Documentação

- [`README.md`](README.md:1) - Documentação completa
- [`INICIO_RAPIDO.md`](INICIO_RAPIDO.md:1) - Guia de início rápido
- [`PERSONALIZACAO.md`](PERSONALIZACAO.md:1) - Como personalizar
- [`ESTRUTURA.md`](ESTRUTURA.md:1) - Estrutura do projeto

## 🎨 Personalização

### Alterar Cardápio
Edite [`src/config/cardapio.js`](src/config/cardapio.js:1)

### Alterar Mensagens
Edite [`src/services/ChatbotService.js`](src/services/ChatbotService.js:1)

### Adicionar Produtos
```javascript
{ id: 11, nome: 'Nova Pizza', preco: 35.00, tipo: 'pizza' }
```

## 🔒 Segurança

- Variáveis de ambiente no `.env`
- Arquivo de banco não versionado (`.gitignore`)
- SQL Injection protegido (Sequelize)

## 📈 Escalabilidade

- Suporta múltiplos usuários simultâneos
- Arquitetura em camadas
- Separação de responsabilidades
- Fácil manutenção

## 💾 Backup Simples

```bash
# Backup
cp database.sqlite backup.sqlite

# Restaurar
cp backup.sqlite database.sqlite
```

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Erro de permissão | Execute como administrador |
| QR Code não aparece | Reinstale dependências |
| WhatsApp desconecta | Escaneie QR novamente |

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa no [`README.md`](README.md:1).

---

**Versão**: 1.0.0  
**Status**: ✅ Pronto para uso  
**Licença**: ISC
