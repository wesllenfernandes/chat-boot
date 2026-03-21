@echo off
echo Iniciando Chatbot da Pizzaria...
echo.

REM Verifica se Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado:
node --version
echo.

echo Iniciando servidor...
node server.js

pause
