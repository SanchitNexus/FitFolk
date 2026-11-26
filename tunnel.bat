@echo off
title FitFolk Worldwide Tunnel
cls
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
node start-tunnel.cjs
pause
