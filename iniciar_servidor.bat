@echo off
title CampusVoz - Servidor Local del Buzon Estudiantil
echo ========================================================
echo   CAMPUSVOZ: PORTAL DE SUGERENCIAS PARA EL AMBIENTE ESTUDIANTIL
echo   Proyecto Web HTML5 + XML + XSLT en Modo Oscuro
echo ========================================================
echo.
echo Iniciando servidor web local en el puerto 8000...
echo Abre tu navegador en: http://localhost:8000
echo.
start http://localhost:8000
python -m http.server 8000
pause
