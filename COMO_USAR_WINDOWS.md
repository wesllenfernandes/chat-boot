# 🚀 Como Usar - Windows

## Método 1: Usar Arquivos .BAT (Mais Fácil!)

### 1. Limpar o Banco de Dados
Dê um duplo clique no arquivo:
```
limpar-banco.bat
```

Ou execute no terminal:
```cmd
limpar-banco.bat
```

### 2. Iniciar o Bot
Dê um duplo clique no arquivo:
```
iniciar.bat
```

Ou execute no terminal:
```cmd
iniciar.bat
```

## Método 2: Usar Node.js Diretamente

### 1. Limpar o Banco de Dados
```cmd
del database.sqlite
```

### 2. Iniciar o Bot
```cmd
node server.js
```

## Método 3: Usar npm (Se estiver instalado)

### 1. Limpar o Banco de Dados
```cmd
npm run limpar-banco
```

### 2. Iniciar o Bot
```cmd
npm start
```

## ⚠️ Se npm não funcionar

O erro que você está vendo acontece quando o npm não está instalado ou não está no PATH.

**Solução:** Use o Método 1 (arquivos .bat) ou Método 2 (node diretamente).

## 📋 Verificar se Node.js está instalado

Abra o PowerShell ou CMD e digite:
```cmd
node --version
```

Se aparecer uma versão (ex: v18.0.0), o Node.js está instalado!

Se não aparecer, instale o Node.js em: https://nodejs.org/

## 🔧 Primeira Vez - Instalar Dependências

Se você acabou de baixar o projeto, precisa instalar as dependências primeiro:

### Opção 1: Usando npm
```cmd
npm install
```

### Opção 2: Manualmente
Se npm não funcionar, baixe o Node.js em: https://nodejs.org/

Depois instale, abra um novo terminal e execute:
```cmd
npm install
```

## 🎯 Fluxo Completo

1. **Instalar dependências** (primeira vez apenas):
   ```cmd
   npm install
   ```

2. **Limpar banco antigo** (se necessário):
   ```cmd
   limpar-banco.bat
   ```

3. **Iniciar o bot**:
   ```cmd
   iniciar.bat
   ```

4. **Escaneie o QR Code** no WhatsApp

5. **Pronto!** O bot está online! 🍕

## 💡 Dicas

- Sempre use o **PowerShell** ou **CMD** como Administrador
- Se der erro de permissão, feche o terminal e abra como Administrador
- Mantenha o terminal aberto enquanto o bot estiver rodando
- Para parar o bot, pressione `Ctrl + C`

## 🆘 Problemas Comuns

### "node não é reconhecido"
**Solução:** Instale o Node.js em https://nodejs.org/

### "npm não é reconhecido"
**Solução:** Use os arquivos .bat ou execute `node server.js` diretamente

### Erro de permissão
**Solução:** Abra o terminal como Administrador

### Erro no banco de dados
**Solução:** Execute `limpar-banco.bat` e depois `iniciar.bat`

---

**🍕 Bom apetite!**
