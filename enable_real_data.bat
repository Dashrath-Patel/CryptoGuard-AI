@echo off
echo Switching to REAL DATA mode for BNB Chain Scanner...

echo.
echo Backing up current files...
copy "src\app\api\scanner\wallet\route.ts" "src\app\api\scanner\wallet\route_mock_backup.ts" >nul
copy "src\app\api\scanner\contract\route.ts" "src\app\api\scanner\contract\route_mock_backup.ts" >nul

echo.
echo Installing production API endpoints...
copy "src\app\api\scanner\wallet\route_prod.ts" "src\app\api\scanner\wallet\route.ts" >nul
copy "src\app\api\scanner\contract\route_prod.ts" "src\app\api\scanner\contract\route.ts" >nul

echo.
echo ✅ REAL DATA MODE ACTIVATED!
echo.
echo Your BNB Chain scanner is now using:
echo   ✓ Real BSCScan API calls
echo   ✓ Live BNB prices from Binance
echo   ✓ Actual transaction data
echo   ✓ Real contract verification
echo.
echo Test with these BNB Chain addresses:
echo   • CAKE Token: 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
echo   • Binance Hot Wallet: 0x8894E0a0c962CB723c1976a4421c95949bE2D4E3
echo   • PancakeSwap Router: 0x10ED43C718714eb63d5aA57B78B54704E256024E
echo.
echo See REAL_DATA_TESTING.md for complete testing guide.
echo.
pause
