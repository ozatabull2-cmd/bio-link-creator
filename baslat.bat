@echo off
title Bio-Link Creator & AI Optimizer
cd /d "%~dp0"

echo ======================================================
echo   Bio-Link Creator & AI Optimizer Baslatiliyor...
echo ======================================================
echo.

:: Tarayicida uygulamayi ac
start "" "http://localhost:3000"

:: Gerekli bagimliliklari kontrol et (node_modules yoksa yukle)
if not exist node_modules (
    echo node_modules bulunamadi. Paketler yukleniyor...
    call npm install
)

:: Sunucuyu baslat (Path'teki '&' isaretinden dolayi olusan Windows hatasini 
:: engellemek icin npm run dev yerine dogrudan node ile baslatiyoruz)
node "%~dp0node_modules\tsx\dist\cli.mjs" "%~dp0server.ts"
pause
