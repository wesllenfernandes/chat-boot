# 🔧 Troubleshooting - Chatbot Pizzaria

## Problemas Comuns e Soluções

### ❌ Erro: "Navigating frame was detached"

Este é um erro comum do Puppeteer no Windows. Foi corrigido na versão atualizada do [`WhatsAppController.js`](src/controllers/WhatsAppController.js:1).

**Soluções aplicadas:**
- Alterado `headless: true` para `headless: 'new'`
- Removido `--single-process` (causa problemas no Windows)
- Adicionado `defaultViewport` com tamanho específico
- Adicionados argumentos extras para estabilidade

**Se o erro persistir:**

1. **Limpe as sessões do WhatsApp:**
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .\sessions

# Windows (CMD)
rmdir /s /q sessions

# Linux/Mac
rm -rf sessions
```

2. **Reinstale as dependências:**
```bash
npm install
```

3. **Execute novamente:**
```bash
npm start
```

---

### ❌ Erro: "Cannot find module 'puppeteer'"

O whatsapp-web.js depende do Puppeteer, mas às vezes ele não é instalado corretamente.

**Solução:**
```bash
npm install puppeteer
```

Ou instale manualmente o Chromium:
```bash
npx puppeteer browsers install chrome
```

---

### ❌ Erro: "Permission denied" no database.sqlite

**No Windows:**
- Execute o terminal como Administrador
- Ou dê permissões de escrita na pasta do projeto

**No Linux/Mac:**
```bash
chmod 755 database.sqlite
```

---

### ❌ QR Code não aparece

**Possíveis causas:**

1. **Puppeteer não instalado:**
```bash
npm install puppeteer
```

2. **Problemas com o Chromium:**
```bash
npx puppeteer browsers install chrome
```

3. **Firewall bloqueando:**
- Adicione exceção para Node.js no firewall
- Permita conexões de saída na porta 443

---

### ❌ WhatsApp desconecta frequentemente

**Soluções:**

1. **Escaneie o QR Code novamente** - Normal após longos períodos de inatividade

2. **Mantenha o bot ativo:**
   - Evite fechar o terminal
   - Use PM2 para manter o processo rodando:
   ```bash
   npm install -g pm2
   pm2 start server.js --name pizzaria-bot
   pm2 save
   pm2 startup
   ```

---

### ❌ Erro: "Port 3000 is already in use"

**Solução 1: Matar o processo na porta 3000**

**Windows (PowerShell):**
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <NUMERO_DO_PROCESSO> -Force
```

**Windows (CMD):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <NUMERO_DO_PROCESSO> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Solução 2: Usar outra porta**

Edite o arquivo `.env`:
```env
PORT=3001
```

---

### ❌ Erro: "ECONNREFUSED" ao conectar ao banco

**Com SQLite, isso não deve acontecer**, mas se ocorrer:

1. **Verifique se o arquivo database.sqlite existe:**
```bash
ls database.sqlite  # Linux/Mac
dir database.sqlite  # Windows
```

2. **Se não existir, o projeto criará automaticamente na primeira execução**

3. **Verifique permissões de escrita:**
```bash
# Linux/Mac
chmod 644 database.sqlite

# Windows
# Execute como administrador
```

---

### ❌ Bot não responde às mensagens

**Verificações:**

1. **Bot está online?**
   - Deve aparecer "✅ Cliente WhatsApp conectado com sucesso!"

2. **Mensagem de grupo?**
   - O bot ignora mensagens de grupos por padrão

3. **Erro no console?**
   - Verifique se há erros no terminal

4. **Reinicie o bot:**
   - Pressione Ctrl+C
   - Execute `npm start` novamente

---

### ❌ Erro: "spawn ENOENT"

**Problema:** Chromium ou Puppeteer não instalado corretamente.

**Solução:**
```bash
npm install puppeteer
npx puppeteer browsers install chrome
```

---

### 📱 Dicas para Uso no WhatsApp

1. **Use um número dedicado** - Não use seu número pessoal
2. **Mantenha o telefone conectado** - O WhatsApp precisa estar ativo
3. **Evite spam** - O WhatsApp pode bloquear números suspeitos
4. **Teste primeiro** - Faça testes com seu próprio número

---

### 🔍 Logs e Debug

**Ativar logs detalhados:**

No arquivo [`server.js`](server.js:1), altere a configuração do Sequelize:

```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: true,  // Mude de false para true
  // ...
});
```

---

### 🚀 Performance

**Se o bot estiver lento:**

1. **Limpe o banco de dados antigo:**
```bash
rm database.sqlite
# O banco será recriado automaticamente
```

2. **Limpe sessões do WhatsApp:**
```bash
rm -rf sessions
```

3. **Reinstale dependências:**
```bash
rm -rf node_modules
npm install
```

---

### 📞 Ainda com problemas?

1. **Verifique a versão do Node.js:**
```bash
node --version
# Deve ser v14 ou superior
```

2. **Verifique a versão do npm:**
```bash
npm --version
```

3. **Atualize tudo:**
```bash
npm update
```

4. **Consulte a documentação:**
   - [`README.md`](README.md:1) - Documentação completa
   - [`INICIO_RAPIDO.md`](INICIO_RAPIDO.md:1) - Guia rápido

---

### 💻 Requisitos do Sistema

**Mínimos:**
- Node.js 14+
- 2GB RAM
- 500MB de espaço em disco

**Recomendados:**
- Node.js 18+
- 4GB RAM
- 1GB de espaço em disco

---

**🍕 Se tudo mais falhar, tente reiniciar o computador! Às vezes é a solução mais simples.**
