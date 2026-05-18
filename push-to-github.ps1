Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "      StreamBazaar 1-Click Git Push Tool           " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before running this script, make sure you have created a NEW repository" -ForegroundColor Yellow
Write-Host "on GitHub at: https://github.com/new (do NOT initialize it with README)." -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "Please paste your GitHub repository URL (e.g. https://github.com/your-username/your-repo.git)"

if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "❌ Repository URL cannot be empty. Exiting." -ForegroundColor Red
    Exit
}

# Clear any existing remote origin
git remote remove origin 2>$null

# Configure and push
git remote add origin $repoUrl
git branch -M main
Write-Host "✅ Set remote origin to: $repoUrl" -ForegroundColor Green
Write-Host "🚀 Pushing codebase to GitHub main branch..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Successfully pushed to GitHub! Your code is now live. 🚀" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Failed to push. Verify your GitHub repository URL, internet connection, and permissions." -ForegroundColor Red
}
