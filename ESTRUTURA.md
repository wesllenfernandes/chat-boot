# 📐 Estrutura do Projeto

## Visão Geral

```
chatbot-pizzaria/
│
├── 📄 server.js                 # Ponto de entrada da aplicação
├── 📄 package.json              # Dependências do projeto
├── 📄 .env                      # Variáveis de ambiente
├── 📄 .env.example              # Exemplo de variáveis
├── 📄 .gitignore                # Arquivos ignorados pelo Git
├── 📄 database.sqlite           # Banco de dados SQLite (criado automaticamente)
├── 📄 README.md                 # Documentação completa
├── 📄 INICIO_RAPIDO.md          # Guia de início rápido
├── 📄 PERSONALIZACAO.md         # Guia de personalização
├── 📄 ESTRUTURA.md              # Este arquivo
│
└── 📁 src/                      # Código fonte
    │
    ├── 📁 config/               # Configurações
    │   ├── database.js          # Conexão com SQLite
    │   └── cardapio.js          # Cardápio da pizzaria
    │
    ├── 📁 models/               # Models (Sequelize)
    │   ├── Cliente.js           # Model de Cliente
    │   ├── Pedido.js            # Model de Pedido
    │   ├── ItemPedido.js        # Model de Item do Pedido
    │   └── index.js             # Export e relacionamentos
    │
    ├── 📁 services/             # Lógica de Negócio
    │   ├── ClienteService.js    # Serviços de Cliente
    │   ├── PedidoService.js     # Serviços de Pedido
    │   └── ChatbotService.js    # Lógica do Chatbot
    │
    └── 📁 controllers/          # Controladores
        └── WhatsAppController.js # Controle do WhatsApp
```

## Fluxo de Dados

```
┌─────────────┐
│   WhatsApp  │
│   Usuário   │
└──────┬──────┘
       │ Mensagem
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    server.js                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              WhatsAppController                       │  │
│  │  • Recebe mensagem do WhatsApp                       │  │
│  │  • Envia resposta para o WhatsApp                    │  │
│  │  • Gerencia conexão e autenticação                   │  │
│  └───────────────────┬──────────────────────────────────┘  │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 ChatbotService                              │
│  • Processa mensagem                                        │
│  • Identifica etapa do usuário                              │
│  • Determina próxima ação                                   │
│  • Gera resposta apropriada                                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├──► ClienteService
       │    • Buscar/criar cliente
       │    • Atualizar etapa
       │    • Gerenciar carrinho
       │
       ├──► PedidoService
       │    • Criar pedido
       │    • Calcular total
       │    • Formatar resumo
       │
       └──► Models (Sequelize)
            • Cliente
            • Pedido
            • ItemPedido
```

## Fluxo do Usuário

```
┌──────────┐
│   MENU   │  Estado inicial
└────┬─────┘
     │ Usuário digita número do produto
     ▼
┌──────────────┐
│  QUANTIDADE  │  Pergunta quantidade
└────┬─────────┘
     │ Usuário digita quantidade
     ▼
┌──────────────┐
│    MENU      │  Pergunta se quer mais itens
└────┬─────────┘
     │ Usuário digita "finalizar"
     ▼
┌──────────────┐
│  PAGAMENTO   │  Pergunta forma de pagamento
└────┬─────────┘
     │ Usuário escolhe pagamento
     ▼
┌──────────────┐
│   ENDERECO   │  Pergunta endereço
└────┬─────────┘
     │ Usuário digita endereço
     ▼
┌──────────────┐
│ CONFIRMACAO  │  Mostra resumo
└────┬─────────┘
     │ Usuário confirma
     ▼
┌──────────────┐
│   MENU       │  Pedido salvo, volta ao início
└──────────────┘
```

## Relacionamentos do Banco de Dados

```
┌─────────────────┐
│     CLIENTES    │
├─────────────────┤
│ id (PK)         │
│ telefone        │
│ etapa_atual     │
│ produto_sel     │
│ itens_pedido    │
└────────┬────────┘
         │ 1:N
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│     PEDIDOS     │       │   ITENS_PEDIDO  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │ 1:N   │ id (PK)         │
│ cliente_id (FK) │──────►│ pedido_id (FK)  │
│ total           │       │ produto         │
│ forma_pagamento │       │ quantidade      │
│ endereco        │       │ preco           │
│ status          │       └─────────────────┘
└─────────────────┘
```

## Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                   │
│                   (WhatsApp Web.js)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE CONTROLE                       │
│                  (WhatsAppController)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE SERVIÇOS                        │
│        (ChatbotService, ClienteService, PedidoService)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE DADOS                           │
│              (Models: Cliente, Pedido, ItemPedido)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                            │
│                    (SQLite - Arquivo)                        │
└─────────────────────────────────────────────────────────────┘
```

## Responsabilidades por Arquivo

### server.js
- Inicializar servidor Express
- Configurar middlewares
- Definir rotas HTTP
- Inicializar WhatsApp
- Sincronizar banco de dados

### config/database.js
- Configurar conexão Sequelize com SQLite
- Testar conexão
- Exportar instância sequelize

### config/cardapio.js
- Definir produtos do cardápio
- Formatar cardápio para exibição
- Buscar produto por ID

### models/Cliente.js
- Definir schema da tabela clientes
- Configurar campos e validações

### models/Pedido.js
- Definir schema da tabela pedidos
- Configurar campos e validações

### models/ItemPedido.js
- Definir schema da tabela itens_pedido
- Configurar campos e validações

### models/index.js
- Exportar todos os models
- Configurar relacionamentos

### services/ClienteService.js
- Buscar ou criar cliente
- Atualizar etapa do cliente
- Gerenciar carrinho de compras
- Limpar pedido

### services/PedidoService.js
- Criar pedido no banco
- Buscar pedidos
- Calcular total
- Formatar resumo do pedido

### services/ChatbotService.js
- Processar mensagens do usuário
- Controlar fluxo de conversação
- Gerenciar estados do chatbot
- Validar entradas do usuário

### controllers/WhatsAppController.js
- Gerenciar cliente WhatsApp
- Receber mensagens
- Enviar respostas
- Gerar QR Code

## Variáveis de Ambiente

```env
# Servidor
PORT=3000                  # Porta do Express
NODE_ENV=development       # Ambiente (dev/prod)

# WhatsApp
WHATSAPP_SESSION_PATH=./sessions  # Caminho das sessões
```

## Dependências Principais

```json
{
  "express": "Framework web",
  "sequelize": "ORM para Node.js",
  "sqlite3": "Driver SQLite",
  "whatsapp-web.js": "Integração WhatsApp",
  "qrcode-terminal": "Exibir QR Code",
  "dotenv": "Variáveis de ambiente",
  "cors": "Compartilhamento de recursos"
}
```

## Portas e Endpoints

```
Porta: 3000

Endpoints HTTP:
  GET  /           - Status do servidor
  GET  /status     - Status WhatsApp + Banco
  GET  /pedidos/:telefone - Pedidos do cliente

WebSocket (WhatsApp):
  - Recebe mensagens automaticamente
  - Envia respostas automaticamente
```

## Logs e Monitoramento

```
Console Output:
  ✅ Conexão com o banco SQLite estabelecida
  📁 Arquivo do banco: database.sqlite
  ✅ Models sincronizados
  📱 Cliente WhatsApp inicializado
  📩 Mensagem recebida
  📤 Resposta enviada
  ✅ Pedido confirmado
```

## Vantagens do SQLite

- ✅ **Sem servidor** - Não precisa instalar MySQL
- ✅ **Portátil** - Banco em um único arquivo
- ✅ **Simples** - Fácil backup (copiar arquivo)
- ✅ **Rápido** - Ideal para pequenos projetos
- ✅ **Zero configuração** - Funciona imediatamente

---

**📚 Para mais informações, consulte:**
- [`README.md`](README.md:1) - Documentação completa
- [`INICIO_RAPIDO.md`](INICIO_RAPIDO.md:1) - Guia de início rápido
- [`PERSONALIZACAO.md`](PERSONALIZACAO.md:1) - Como personalizar
