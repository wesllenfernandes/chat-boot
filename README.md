# 🍕 Chatbot de Pedidos para Pizzaria

Chatbot de atendimento automatizado para pedidos de pizzaria com integração ao WhatsApp.

## 📋 Funcionalidades

- ✅ Cardápio digital interativo
- ✅ Seleção de produtos por número
- ✅ Cálculo automático do total do pedido
- ✅ Múltiplas formas de pagamento
- ✅ Registro de endereço de entrega
- ✅ Resumo do pedido antes da confirmação
- ✅ Persistência no banco de dados SQLite
- ✅ Suporte a múltiplos usuários simultâneos
- ✅ Validação de entradas do usuário
- ✅ **Sistema de timeout automático** (aviso em 2min, encerra em 5min)

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para Node.js
- **SQLite** - Banco de dados leve e sem servidor
- **whatsapp-web.js** - Integração com WhatsApp
- **QR Code Terminal** - Geração de QR Code

## 📁 Estrutura do Projeto

```
chatbot-pizzaria/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuração do banco de dados
│   │   └── cardapio.js       # Cardápio da pizzaria
│   ├── models/
│   │   ├── Cliente.js        # Model de Cliente
│   │   ├── Pedido.js         # Model de Pedido
│   │   ├── ItemPedido.js     # Model de ItemPedido
│   │   └── index.js          # Export e relacionamentos
│   ├── services/
│   │   ├── ClienteService.js # Lógica de negócio de clientes
│   │   ├── PedidoService.js  # Lógica de negócio de pedidos
│   │   └── ChatbotService.js # Lógica do chatbot
│   └── controllers/
│       └── WhatsAppController.js # Controle do WhatsApp
├── sessions/                 # Sessões do WhatsApp (criado automaticamente)
├── database.sqlite           # Banco de dados SQLite (criado automaticamente)
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis de ambiente
├── package.json              # Dependências do projeto
├── server.js                 # Arquivo principal
└── README.md                 # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Passo 1: Instalar as dependências

```bash
npm install
```

### Passo 2: Configurar variáveis de ambiente

O arquivo `.env` já está configurado com os valores padrão. Não é necessário alterar nada para usar SQLite.

```env
PORT=3000
NODE_ENV=development
WHATSAPP_SESSION_PATH=./sessions
```

### Passo 3: Executar o projeto

```bash
npm start
```

Ou para desenvolvimento (com auto-reload):

```bash
npm run dev
```

### Passo 4: Conectar o WhatsApp

1. Ao executar o projeto, um QR Code será exibido no terminal
2. Abra o WhatsApp no seu celular
3. Vá em **Aparelhos conectados** > **Conectar um aparelho**
4. Escaneie o QR Code exibido no terminal
5. Pronto! O chatbot está online

**Nota:** O banco de dados SQLite será criado automaticamente no arquivo `database.sqlite` na primeira execução.

## 📱 Como Usar

### Fluxo de Atendimento

1. **Início**: O usuário envia "oi" ou qualquer mensagem
2. **Cardápio**: O bot exibe o cardápio com opções numeradas
3. **Escolha**: O usuário digita o número do produto desejado
4. **Quantidade**: O bot pergunta a quantidade
5. **Mais itens**: O usuário pode adicionar mais itens ou finalizar
6. **Pagamento**: Digite 1 (Dinheiro), 2 (Pix) ou 3 (Cartão)
7. **Endereço**: Informação do endereço de entrega
8. **Confirmação**: Resumo do pedido e confirmação

### Comandos Especiais

- `menu` - Volta ao cardápio
- `reiniciar` - Reinicia o pedido
- `cancelar` - Cancela o pedido atual
- `finalizar` - Finaliza a seleção de produtos

### ⏰ Sistema de Timeout Automático

O bot possui um sistema de timeout para otimizar o atendimento:

- **⚠️ Aviso (2 minutos)**: Se o cliente não responder em 2 minutos, recebe um aviso
- **🔒 Encerramento (5 minutos)**: Após 5 minutos de inatividade, o atendimento é encerrado automaticamente
- **📡 Reinício**: Basta enviar qualquer mensagem para continuar ou digitar "menu" para reiniciar

**Exemplo de aviso:**
```
⏰ Aviso de Inatividade

Percebemos que você está demorando para responder.
⏱️ Você tem mais 3 minutos antes que o atendimento seja encerrado.

📝 Para continuar, basta enviar qualquer mensagem.

Se quiser reiniciar, digite "menu"
```

### Mensagens de Ativação

O bot responde a diversas saudações e comandos de ativação:

**Saudações:**
- `oi`, `olá`, `ola`, `oie`
- `bom dia`, `bomdia`, `boa dia`
- `boa tarde`, `boatarde`
- `boa noite`, `boanoite`
- `hey`, `ei`, `eai`, `eae`
- `salve`, `salve salve`, `opa`, `fala`

**Comandos:**
- `cardápio`, `cardapio`, `menu`
- `pedido`, `pedir`, `quero`, `gostaria`
- `inicio`, `iniciar`, `start`
- `ajuda`, `help`, `socorro`

**Exemplo:**
```
Usuário: boa noite
Bot: 🌙 Boa noite! Bem-vindo à Pizzaria! 🍕
     [Cardápio...]

Usuário: eai
Bot: 👋 E aí! Bem-vindo à Pizzaria! 🍕
     [Cardápio...]
```

## 🗄️ Estrutura do Banco de Dados

O banco de dados SQLite será criado automaticamente no arquivo `database.sqlite` com as seguintes tabelas:

### Tabela: clientes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária (auto-incremento) |
| telefone | TEXT | Telefone do cliente (único) |
| etapa_atual | TEXT | Etapa atual do fluxo |
| produto_selecionado | JSON | Produto temporariamente selecionado |
| itens_pedido | JSON | Itens do pedido em andamento |

### Tabela: pedidos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária (auto-incremento) |
| cliente_id | INTEGER | Foreign key para clientes |
| total | REAL | Valor total do pedido |
| forma_pagamento | TEXT | Forma de pagamento |
| endereco | TEXT | Endereço de entrega |
| status | TEXT | Status do pedido |

### Tabela: itens_pedido

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária (auto-incremento) |
| pedido_id | INTEGER | Foreign key para pedidos |
| produto | TEXT | Nome do produto |
| quantidade | INTEGER | Quantidade do item |
| preco | REAL | Preço unitário |

## 📄 Cardápio Padrão

O cardápio inclui:

1. Pizza Calabresa - R$ 30,00
2. Pizza Frango - R$ 28,00
3. Pizza Margherita - R$ 26,00
4. Pizza Portuguesa - R$ 32,00
5. Pizza Quatro Queijos - R$ 35,00
6. Pizza Pepperoni - R$ 34,00
7. Refrigerante - R$ 6,00
8. Suco Natural - R$ 8,00
9. Água Mineral - R$ 4,00
10. Batata Frita - R$ 15,00

*Você pode editar o cardápio em `src/config/cardapio.js`*

## 🔧 Personalização

### Alterar o Cardápio

Edite o arquivo `src/config/cardapio.js`:

```javascript
const cardapio = [
  { id: 1, nome: 'Pizza Calabresa', preco: 30.00, tipo: 'pizza' },
  // Adicione ou remova itens conforme necessário
];
```

### Alterar Mensagens do Bot

Edite o arquivo `src/services/ChatbotService.js` para personalizar as respostas do bot.

## 🐛 Troubleshooting

### Erro ao iniciar o servidor (SQLite constraint error)

**Problema:** Banco de dados SQLite com estrutura antiga.

**Solução:**
```bash
npm run limpar-banco
npm start
```

Ou manualmente:
```bash
# Windows
del database.sqlite

# Linux/Mac
rm database.sqlite
```

### Erro ao instalar dependências

- Certifique-se de ter o Node.js instalado (v14 ou superior)
- Tente limpar o cache: `npm cache clean --force`
- Remova `node_modules` e `package-lock.json`, depois execute `npm install` novamente

### QR Code não aparece

- Verifique se o Puppeteer está instalado corretamente
- Tente executar com permissões de administrador
- Verifique se não há outro processo usando a porta 3000

### WhatsApp desconecta frequentemente

- O WhatsApp Web pode desconectar após longos períodos de inatividade
- Escaneie o QR Code novamente para reconectar

### Erro de permissão no arquivo database.sqlite

- Verifique se o diretório tem permissão de escrita
- No Windows, execute o terminal como administrador
- No Linux/Mac, use `chmod` para dar permissões

## 📞 API Endpoints

### GET `/`
Status do servidor

### GET `/status`
Status da conexão WhatsApp e banco de dados

### GET `/pedidos/:telefone`
Buscar pedidos de um cliente

## 💾 Backup do Banco de Dados

Para fazer backup do banco de dados SQLite, basta copiar o arquivo `database.sqlite`:

```bash
cp database.sqlite backup.sqlite
```

Para restaurar:

```bash
cp backup.sqlite database.sqlite
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido para fins educacionais e comerciais.

---

**🍕 Bom apetite e bons pedidos!**
