@echo off
title Deploy FitFolk to Vercel
echo ========================================================
echo        Deploying FitFolk to Vercel (100%% Free)
echo ========================================================
echo.
echo If prompted to log in, choose GitHub or Email in the browser.
echo.
call npx.cmd vercel --prod
echo.
pause
