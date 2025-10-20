# PowerShell script to create .env.local file
# Run this from the frontend directory

$envContent = @"
NEXT_PUBLIC_API_URL=http://localhost:8000/api
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline

Write-Host "[SUCCESS] .env.local file created!" -ForegroundColor Green
Write-Host ""
Write-Host "Content:" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_API_URL=http://localhost:8000/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure backend is running: cd backend && python manage.py runserver" -ForegroundColor White
Write-Host "2. Start frontend: npm run dev" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000" -ForegroundColor White

