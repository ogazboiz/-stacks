Write-Host "========================================"
Write-Host "Deploying AMM Contracts to Testnet" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

Write-Host "Step 1: Generating deployment plan..." -ForegroundColor Yellow
clarinet deployments generate --testnet
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error generating deployment plan!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Step 2: Applying deployment to testnet..." -ForegroundColor Yellow
Write-Host "This will deploy your contracts and may take a few minutes..." -ForegroundColor Green
clarinet deployments apply --testnet
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error deploying contracts!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Please copy the deployed contract addresses from above"
Write-Host "and update them in: frontend\amm\src\lib\amm.ts"
Write-Host ""
Read-Host "Press Enter to exit"
