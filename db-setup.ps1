# PowerShell script for setting up OpenSuite development database

Write-Host "Setting up OpenSuite development database..." -ForegroundColor Green

# Start the containers
docker-compose up -d

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Create databases for each microservice
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE identity_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE erp_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE hrm_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE crm_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE collab_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE tech_support_engine WITH OWNER postgres ENCODING 'UTF8';" 
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE it_engine WITH OWNER postgres ENCODING 'UTF8';" 

Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host "PostgreSQL is available at localhost:5432" -ForegroundColor Cyan
Write-Host "pgAdmin is available at http://localhost:5050" -ForegroundColor Cyan
Write-Host "pgAdmin credentials: admin@opensuite.com / admin" -ForegroundColor Cyan