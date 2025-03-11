import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// This script runs migrations for the identity engine database

async function main() {
  console.log('Starting database migration...');
  
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/identity_engine';
  
  // For migrations, we use a separate connection with a different configuration
  const migrationClient = postgres(connectionString, { max: 1 });
  
  // Initialize drizzle with this client
  const db = drizzle(migrationClient);
  
  // Run migrations from the specified directory
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'src/migrations/files' });
  
  console.log('Migrations completed successfully!');
  
  // Close the connection when done
  await migrationClient.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});