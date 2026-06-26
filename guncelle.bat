@echo off
title Bio-Link Guncellemeleri Yukle
cd /d "%~dp0"

echo ======================================================
echo   Degisiklikler GitHub'a Yukleniyor...
echo ======================================================
echo.

:: Git durumunu kontrol et ve tüm değişiklikleri ekle
git add .
git commit -m "Uygulama ve profil guncellendi"
git push

echo.
echo ======================================================
echo   Basarili! Degisiklikler GitHub'a yuklendi.
echo   Vercel siteniz 10 saniye icinde otomatik guncellenecektir.
echo ======================================================
echo.
pause
