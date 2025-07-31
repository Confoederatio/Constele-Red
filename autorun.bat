@echo off
title "Constele Red"
echo [Constele Red] Auto-run is starting ..
:main
npm start
timeout /t 30
echo [Constele Red] Crashed! Restarting ..
goto main
