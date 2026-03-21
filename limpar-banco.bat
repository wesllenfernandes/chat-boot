@echo off
echo Limpando banco de dados...
echo.

if exist database.sqlite (
    echo Criando backup...
    copy database.sqlite database.sqlite.backup
    echo Backup criado: database.sqlite.backup
    echo.
    
    echo Deletando banco de dados...
    del database.sqlite
    echo Banco de dados deletado com sucesso!
    echo.
    echo Execute "iniciar.bat" ou "npm start" para criar um novo banco.
) else (
    echo Nenhum banco de dados encontrado.
    echo.
    echo Execute "iniciar.bat" ou "npm start" para criar um novo banco.
)

echo.
pause
