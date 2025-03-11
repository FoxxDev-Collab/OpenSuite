import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { graphqlServer } from '@hono/graphql-server';
import { schema } from './graphql/schema';
import { AppDataSource } from './database/data-source';

// Load environment variables
config();

// Create Hono app
const app = new Hono();

// Initialize database
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

// Middleware
app.use('*', logger());
app.use(cors());
app.use('/api/*', async (c, next) => {
  // Skip JWT validation for auth routes and GraphQL playground
  if (c.req.path.startsWith('/api/auth/') || 
      (c.req.path === '/api/graphql' && c.req.method === 'GET')) {
    return await next();
  }
  
  // Apply JWT validation to all other API routes
  const middleware = jwt({
    secret: process.env.JWT_SECRET || 'development-secret'
  });
  
  return middleware(c, next);
});

// Root route
app.get('/', (c) => c.text('Identity Engine API'));

// Health check
app.get('/health', (c) => c.json({ 
  status: 'ok',
  timestamp: new Date().toISOString()
}));

// GraphQL endpoint
app.use('/api/graphql', graphqlServer({
  schema
}));

// Start the server
const port = parseInt(process.env.PORT || '4000');
console.log(`Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port
});

console.log(`Server running at http://localhost:${port}`);
console.log(`GraphQL Playground available at http://localhost:${port}/api/graphql`);

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing database connection...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing database connection...');
  await AppDataSource.destroy();
  process.exit(0);
});