import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Role } from './entities/Role';
import { Permission } from './entities/Permission';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'identity_engine',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, Role, Permission],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
  // Add this to ensure uuid-ossp extension is available
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'each',
  extra: {
    // Add this to ensure proper SSL handling
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
});

// Initialize the data source
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      
      // Create uuid-ossp extension if it doesn't exist
      await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      
      console.log('Data Source has been initialized!');
    }
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};