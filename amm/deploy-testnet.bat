@echo off
echo ========================================
echo Deploying AMM Contracts to Testnet
echo ========================================
echo.

echo Step 1: Generating deployment plan...
clarinet deployments generate --testnet
if errorlevel 1 (
    echo Error generating deployment plan!
    pause
    exit /b 1
)
echo.

echo Step 2: Applying deployment to testnet...
echo This will deploy your contracts and may take a few minutes...
clarinet deployments apply --testnet
if errorlevel 1 (
    echo Error deploying contracts!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Please copy the deployed contract addresses from above
echo and update them in:
echo   frontend\amm\src\lib\amm.ts
echo.
pause
