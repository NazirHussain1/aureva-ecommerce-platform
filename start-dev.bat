@echo off
echo ========================================
echo   Starting Aureva Development Servers
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

start "Aureva Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Aureva Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
