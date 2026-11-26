@echo off
title FitFolk Dev Server
echo Starting FitFolk on http://localhost:5173 ...
node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173
pause
