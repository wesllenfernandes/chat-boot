# Passo a passo para hospedar na AWS EC2

Este guia assume que a maquina virtual EC2 ja esta criada, com acesso SSH funcionando, e que o projeto ja foi baixado para a maquina. Os comandos abaixo consideram Ubuntu/Debian.

## 1. Acessar a maquina

No seu computador:

```bash
ssh -i sua-chave.pem ubuntu@IP_PUBLICO_DA_EC2
```

Depois entre na pasta do projeto:

```bash
cd ~/chat-boot-main
```

Se o projeto estiver em outro lugar, use:

```bash
pwd
ls
```

para confirmar o caminho correto.

## 2. Atualizar o sistema

```bash
sudo apt update
sudo apt upgrade -y
```

## 3. Instalar dependencias do sistema

O projeto usa `whatsapp-web.js`, que depende de Chromium/Puppeteer para abrir o WhatsApp Web em modo headless.

```bash
sudo apt install -y \
  curl \
  ca-certificates \
  gnupg \
  build-essential \
  libcups2 \
  libcairo2 \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm1 \
  libxdamage1 \
  libxcomposite1 \
  libxrandr2 \
  libxss1 \
  libxshmfence1 \
  libpangocairo-1.0-0 \
  libasound2 \
  xdg-utils \
  fonts-liberation
```

Se sua imagem Ubuntu nao tiver o pacote `libasound2`, tente:

```bash
sudo apt install -y libasound2t64
```

Se o Puppeteer/Chromium falhar com erro `libcups.so.2: cannot open shared object file`, instale:

```bash
sudo apt install -y libcups2
```

Se falhar com `libXdamage.so.1: cannot open shared object file`, instale:

```bash
sudo apt install -y libxdamage1
```

Se falhar com `libcairo.so.2: cannot open shared object file`, instale:

```bash
sudo apt install -y libcairo2
```

Se falhar com `libpango-1.0.so.0: cannot open shared object file`, instale:

```bash
sudo apt install -y libpango-1.0-0
```

Em maquinas EC2 muito enxutas, pode ser melhor instalar de uma vez o conjunto de bibliotecas graficas mais comum do Chromium:

```bash
sudo apt install -y \
  libcups2 \
  libcairo2 \
  libxdamage1 \
  libxcomposite1 \
  libxrandr2 \
  libxss1 \
  libxshmfence1 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libx11-xcb1 \
  libxcb1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrender1 \
  libxtst6
```

## 4. Instalar Node.js

Recomendado usar Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verifique:

```bash
node -v
npm -v
```

## 5. Instalar Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verifique se o servico subiu:

```bash
systemctl status ollama
```

Se nao estiver rodando:

```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

Baixe os modelos usados pelo projeto:

```bash
ollama pull llama3.2
ollama pull whisper
```

Teste a API local do Ollama:

```bash
curl http://localhost:11434/api/tags
```

## 6. Configurar o projeto

Na pasta do projeto:

```bash
cp .env.example .env
nano .env
```

Use esta configuracao base:

```env
PORT=3000
NODE_ENV=production
WHATSAPP_SESSION_PATH=./sessions
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Crie a pasta de sessoes, caso ainda nao exista:

```bash
mkdir -p sessions
```

## 7. Instalar dependencias do Node

Como o projeto tem `package-lock.json`, use:

```bash
npm ci
```

Se der erro por ambiente diferente ou lock antigo, use:

```bash
npm install
```

Verifique o Ollama pelo script do projeto:

```bash
npm run verificar-ollama
```

## 8. Fazer primeiro teste manual

```bash
npm start
```

O terminal deve mostrar um QR Code. No celular:

1. Abra o WhatsApp.
2. Va em `Aparelhos conectados`.
3. Toque em `Conectar um aparelho`.
4. Escaneie o QR Code mostrado no terminal.

Depois teste a API em outro terminal SSH:

```bash
curl http://localhost:3000/status
```

Quando o WhatsApp conectar e o teste funcionar, pare o processo manual com `Ctrl+C`.

## 9. Rodar em producao com PM2

Instale o PM2:

```bash
sudo npm install -g pm2
```

Inicie o bot:

```bash
pm2 start server.js --name chatbot-pizzaria
```

Salve o processo para reiniciar automaticamente:

```bash
pm2 save
pm2 startup
```

O comando `pm2 startup` vai mostrar outro comando com `sudo`. Copie e execute exatamente o comando que ele mostrar.

Comandos uteis:

```bash
pm2 status
pm2 logs chatbot-pizzaria
pm2 restart chatbot-pizzaria
pm2 stop chatbot-pizzaria
```

Se o QR Code aparecer de novo no futuro, veja pelos logs:

```bash
pm2 logs chatbot-pizzaria
```

## 10. Configurar o Security Group da AWS

Para o bot do WhatsApp funcionar, normalmente nao e necessario abrir a porta `3000` para o mundo. Ele precisa sair para a internet, nao receber conexoes publicas.

Mantenha no Security Group:

- Entrada SSH `22`: liberada apenas para o seu IP.
- Entrada HTTP `80`: opcional, apenas se for publicar a API via Nginx.
- Entrada HTTPS `443`: opcional, apenas se for publicar a API via Nginx com SSL.
- Entrada `3000`: evite abrir publicamente. Se precisar testar externamente, libere temporariamente apenas para o seu IP.

## 11. Opcional: publicar a API com Nginx

Se voce quiser acessar `/status` ou `/pedidos/:telefone` por um dominio, instale Nginx:

```bash
sudo apt install -y nginx
```

Crie a configuracao:

```bash
sudo nano /etc/nginx/sites-available/chatbot-pizzaria
```

Conteudo:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative:

```bash
sudo ln -s /etc/nginx/sites-available/chatbot-pizzaria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Teste:

```bash
curl http://seu-dominio.com/status
```

## 12. Opcional: HTTPS com Certbot

Se tiver dominio apontando para a EC2:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 13. Backup do banco e sessoes

O projeto usa SQLite e sessao local do WhatsApp. Faca backup destes itens:

```bash
mkdir -p ~/backups-chatbot
cp database.sqlite ~/backups-chatbot/database-$(date +%F).sqlite
tar -czf ~/backups-chatbot/sessions-$(date +%F).tar.gz sessions
```

Para automatizar backup diario:

```bash
crontab -e
```

Adicione:

```cron
0 3 * * * cd /home/ubuntu/chat-boot-main && mkdir -p /home/ubuntu/backups-chatbot && cp database.sqlite /home/ubuntu/backups-chatbot/database-$(date +\%F).sqlite && tar -czf /home/ubuntu/backups-chatbot/sessions-$(date +\%F).tar.gz sessions
```

Ajuste `/home/ubuntu/chat-boot-main` se o projeto estiver em outro caminho.

## 14. Checklist final

- `node -v` mostra Node.js instalado.
- `systemctl status ollama` mostra Ollama ativo.
- `ollama list` mostra `llama3.2` e `whisper`.
- `.env` existe com `NODE_ENV=production`.
- `npm ci` ou `npm install` foi executado.
- `npm run verificar-ollama` passou.
- `pm2 status` mostra `chatbot-pizzaria` online.
- `pm2 logs chatbot-pizzaria` mostra WhatsApp conectado.
- `curl http://localhost:3000/status` retorna JSON.
- O WhatsApp foi conectado pelo QR Code.

## 15. Problemas comuns

### QR Code nao aparece

Veja os logs:

```bash
pm2 logs chatbot-pizzaria
```

Se aparecer erro de Chromium/Puppeteer, reinstale as dependencias do passo 3 e reinicie:

```bash
pm2 restart chatbot-pizzaria
```

### Ollama nao responde

```bash
sudo systemctl restart ollama
curl http://localhost:11434/api/tags
pm2 restart chatbot-pizzaria
```

### Bot desconectou do WhatsApp

Abra os logs:

```bash
pm2 logs chatbot-pizzaria
```

Se um novo QR Code aparecer, escaneie novamente. A pasta `sessions` guarda a autenticacao para reduzir reconexoes.

### Porta 3000 nao abre externamente

Confira:

```bash
curl http://localhost:3000/status
```

Se funcionar localmente, o problema esta no Security Group, firewall da maquina ou Nginx. Para uso apenas como bot de WhatsApp, acesso externo a porta 3000 nao e obrigatorio.
