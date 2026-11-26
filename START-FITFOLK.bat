@echo off
title FitFolk All-In-One Server & Tunnel
cls
echo ========================================================
echo         FITFOLK ALL-IN-ONE SERVER & WORLDWIDE TUNNEL
echo ========================================================
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo 1. Checking environment...
node -v >nul 2>&1
if errorlevel 1 (
  echo Error: Node.js was not found in C:\Program Files\nodejs or PATH.
  pause
  exit /b 1
)

echo 2. Starting Dev Server + Cloudflare Direct Tunnel...
echo.
node start-tunnel.cjs
pause
