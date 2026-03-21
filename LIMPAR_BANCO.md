# 🗑️ Como Limpar o Banco de Dados

Se você está recebendo erro ao iniciar o servidor, siga estes passos:

## Windows

### Opção 1: PowerShell
```powershell
Remove-Item -Force .\database.sqlite
```

### Opção 2: CMD
```cmd
del database.sqlite
```

### Opção 3: Manual
1. Abra a pasta do projeto no Windows Explorer
2. Encontre o arquivo `database.sqlite`
3. Delete o arquivo

## Linux/Mac

```bash
rm database.sqlite
```

## Após deletar

Execute o projeto novamente:
```bash
npm start
```

O sistema criará automaticamente um novo banco de dados `database.sqlite` com a estrutura correta!

⚠️ **Atenção:** Isso apagará todos os pedidos anteriores. Se você precisa dos dados, faça um backup antes:
```bash
cp database.sqlite database.sqlite.backup
```
