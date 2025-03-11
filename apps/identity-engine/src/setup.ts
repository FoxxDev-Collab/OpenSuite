import { Client } from 'pg';
import { config } from 'dotenv';
import { AppDataSource } from './database/data-source';

config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to default database first
  });

  try {
    await client.connect();
    
    // Check if database exists
    const dbName = process.env.DB_NAME || 'identity_engine';
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function setup() {
  console.log('Starting setup...');

  try {
    // Create database
    await createDatabase();

    // Initialize TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    // Run migrations
    await AppDataSource.runMigrations();
    console.log('Migrations completed successfully');

    // Import seed file dynamically to ensure migrations run first
    const { seed } = await import('./seed');
    await seed();
    
    console.log('\nSetup completed successfully!');
    console.log('You can now start the server with: bun run dev');
    console.log('Admin credentials: admin@opensuite.com / Admin123!');

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run setup
setup();