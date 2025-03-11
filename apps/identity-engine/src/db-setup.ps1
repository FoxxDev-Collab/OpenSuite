# Identity Engine Database Setup Script

Write-Host "Setting up Identity Engine database..." -ForegroundColor Green

# Install dependencies if needed
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    bun install
}

# Step 1: Generate migration files
Write-Host "Generating migration files..." -ForegroundColor Yellow
bun run generate

# Step 2: Apply migrations
Write-Host "Applying migrations..." -ForegroundColor Yellow
bun run migrate

# Step 3: Seed the database
Write-Host "Seeding database with initial data..." -ForegroundColor Yellow
bun src/seed.ts

Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host "You can now start the server with: bun run dev" -ForegroundColor Cyan
Write-Host "Admin credentials: admin@opensuite.com / Admin123!" -ForegroundColor Cyan