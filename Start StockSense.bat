@echo off
title StockSense Pro - Starting...
color 0B

echo.
echo  ============================================================
echo   ____  _             _      ____
echo  / ___|| |_ ___   ___| | __ / ___|  ___ _ __  ___  ___
echo  \___ \| __/ _ \ / __| |/ / \___ \ / _ \ '_ \/ __|/ _ \
echo   ___) | || (_) | (__|   <   ___) |  __/ | | \__ \  __/
echo  |____/ \__\___/ \___|_|\_\ |____/ \___|_| |_|___/\___|
echo.
echo              PRO INVENTORY MANAGEMENT
echo  ============================================================
echo.

echo  [1/3] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed! Please install from nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js found.
echo.

echo  [2/3] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo  Installing packages, please wait...
    call npm install
) else (
    echo  [OK] Dependencies already installed.
)
echo.

echo  [3/3] Starting StockSense Pro...
echo.
echo  ============================================================
echo   App will open at: http://localhost:3000
echo   Press Ctrl+C in this window to stop the server
echo  ============================================================
echo.

:: Wait 3 seconds then open browser
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Start the dev server
call npm run dev

pause
