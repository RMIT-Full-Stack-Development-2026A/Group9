@echo off
REM TicTacToang - Test Execution Script
REM This script will start both backend and frontend servers for testing

setlocal enabledelayedexpansion
cd /d d:\Desktop\Group9

echo.
echo ==========================================
echo  TicTacToang - Test Environment Setup
echo ==========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js v18 or later.
    exit /b 1
)
echo ✓ Node.js found: & node --version

REM Check npm
echo.
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found.
    exit /b 1
)
echo ✓ npm found: & npm --version

REM Check backend dependencies
echo.
echo [3/5] Checking backend dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies... This may take a minute.
    cd backend
    call npm install
    cd ..
) else (
    echo ✓ Backend dependencies already installed
)

REM Check frontend dependencies
echo.
echo [4/5] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies... This may take a minute.
    cd frontend
    call npm install
    cd ..
) else (
    echo ✓ Frontend dependencies already installed
)

REM Check environment files
echo.
echo [5/5] Checking environment configuration...
if not exist "backend\.env" (
    echo WARNING: backend\.env not found. Creating template...
    (
        echo # MongoDB
        echo MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/Group9
        echo.
        echo # Auth
        echo JWT_SECRET=dev_jwt_secret
        echo PORT=3000
        echo.
        echo # Add other env variables as needed
    ) > backend\.env
    echo Created backend\.env - Please update with real values
)

if not exist "frontend\.env" (
    echo Creating frontend\.env...
    (
        echo VITE_API_BASE_URL=http://localhost:3000
    ) > frontend\.env
)

REM Ready to start
echo.
echo ==========================================
echo ✓ Environment Ready for Testing
echo ==========================================
echo.
echo NEXT STEPS:
echo.
echo Option 1 - Run Both Servers:
echo   Open 2 command windows and run:
echo   Window 1: cd backend ^&^& npm run dev
echo   Window 2: cd frontend ^&^& npm run dev
echo.
echo Option 2 - Open Frontend Only:
echo   cd frontend ^&^& npm run dev
echo   (Make sure backend is running on another terminal)
echo.
echo Option 3 - Build for Production:
echo   cd frontend ^&^& npm run build
echo.
echo ==========================================
echo.
echo For detailed testing guide, see: TEST_PLAN.md
echo.
pause
