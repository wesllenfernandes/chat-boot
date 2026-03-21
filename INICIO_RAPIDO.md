# 🚀 Início Rápido - Chatbot Pizzaria

## Pré-requisitos

✅ Node.js instalado (v14+)  
✅ Conta WhatsApp ativa

## Instalação (3 minutos)

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Iniciar o servidor

```bash
npm start
```

**Nota:** O banco de dados SQLite será criado automaticamente no arquivo `database.sqlite`!

### 3️⃣ Conectar WhatsApp

1. Um QR Code aparecerá no terminal
2. Abra o WhatsApp no celular
3. Vá em **Aparelhos conectados** > **Conectar um aparelho**
4. Escaneie o QR Code

## 🎉 Pronto!

O chatbot está online e pronto para receber pedidos!

## Teste o Bot

Envie uma mensagem para o número conectado:

```
oi
```

O bot responderá com o cardápio!

## Comandos Úteis

| Comando | Ação |
|---------|------|
| `menu` | Ver cardápio |
| `finalizar` | Finalizar pedido |
| `cancelar` | Cancelar pedido |
| `reiniciar` | Recomeçar |

## Mensagens de Ativação

O bot responde a diversas saudações:

**Saudações:**
- `oi`, `olá`, `oie`
- `bom dia`, `boa tarde`, `boa noite`
- `hey`, `eai`, `salve`, `opa`

**Comandos:**
- `cardápio`, `pedido`, `quero`
- `ajuda`, `help`

## Troubleshooting Rápido

### ❌ Erro: "Cannot find module"

**Problema:** Dependências não instaladas  
**Solução:** Execute `npm install`

### ❌ QR Code não aparece

**Problema:** Puppeteer não instalado  
**Solução:** Reinstale as dependências: `npm install`

### ❌ Erro de permissão no database.sqlite

**Problema:** Sem permissão de escrita  
**Solução:** Execute o terminal como administrador (Windows) ou use `sudo` (Linux/Mac)

### ❌ WhatsApp desconecta

**Problema:** Inatividade prolongada  
**Solução:** Escaneie o QR Code novamente

## 📱 Exemplo de Fluxo

```
Usuário: boa noite
Bot: 🌙 Boa noite! Bem-vindo à Pizzaria! 🍕
     [Mostra cardápio]

Usuário: 1
Bot: Qual a quantidade?

Usuário: 2
Bot: Adicionado! Deseja mais itens?

Usuário: finalizar
Bot: 💳 Escolha a forma de pagamento:
     1 - Dinheiro
     2 - Pix
     3 - Cartão

Usuário: 2
Bot: ✅ Forma de pagamento: Pix
     Digite o endereço

Usuário: Rua X, 123
Bot: [Resumo do pedido] Confirma?

Usuário: sim
Bot: ✅ PEDIDO CONFIRMADO!
```

## 💾 Backup do Banco de Dados

Para fazer backup:

```bash
cp database.sqlite backup.sqlite
```

Para restaurar:

```bash
cp backup.sqlite database.sqlite
```

## Suporte

Para mais informações, consulte o [README.md](README.md) completo.

---

**🍕 Bom apetite!**
