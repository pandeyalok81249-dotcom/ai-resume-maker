# ResumeAI – Complete SaaS Runner Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ResumeAI – Intelligent AI Resume Maker & Builder" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$backendDir = "$PSScriptRoot\backend"
$frontendDir = "$PSScriptRoot\frontend"
$mvnCmd = "C:\Users\pande\.gemini\antigravity\scratch\apache-maven-3.9.6\bin\mvn.cmd"
$localRepo = "C:\Users\pande\.gemini\antigravity\scratch\.m2\repository"

# Check if Backend is already running on port 8080
$backendRunning = $false
try {
    $test = Invoke-WebRequest -Uri "http://localhost:8080/api/templates" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($test.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "[✓] Spring Boot Backend is ALREADY running on http://localhost:8080" -ForegroundColor Green
    }
} catch {
    $backendRunning = $false
}

if (-not $backendRunning) {
    Write-Host "[*] Launching Spring Boot Backend (Java 17/21, Spring Boot 3.3.4)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$mvnCmd' -f '$backendDir\pom.xml' compile spring-boot:run '-Dmaven.repo.local=$localRepo'"
    
    # Wait for backend to be ready
    Write-Host "[*] Waiting for backend to start up..." -ForegroundColor Gray
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $test = Invoke-WebRequest -Uri "http://localhost:8080/api/templates" -Method Get -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($test.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {}
    }
    if ($ready) {
        Write-Host "[✓] Backend is ready!" -ForegroundColor Green
    } else {
        Write-Host "[!] Backend is still starting in background terminal." -ForegroundColor Yellow
    }
}

# Start Frontend
Write-Host "[*] Launching React Vite Frontend..." -ForegroundColor Yellow
Set-Location $frontendDir
npm run dev

