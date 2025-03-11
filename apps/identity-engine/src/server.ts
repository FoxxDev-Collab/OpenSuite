import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import type { Context as GraphQLContext } from './graphql/context';

// Extend Hono's context type
type Variables = {
  graphqlContext: GraphQLContext;
  honoCtx: HonoContext;
};

declare module 'hono' {
  interface ContextVariableMap extends Variables {}
}
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { graphqlServer } from '@hono/graphql-server';
import { schema } from './graphql/schema';
import { createContext } from './graphql/context';
import { initializeDatabase, AppDataSource } from './database/data-source';
import type { Context as HonoContext } from 'hono';

// Load environment variables
config();

// Create Hono app
const app = new Hono();

// Initialize database and start server
async function bootstrap() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('Database connection established');

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

    // GraphQL endpoint with GraphiQL
    app.get('/api/graphql', async (c) => {
      return c.html(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GraphiQL</title>
            <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
          </head>
          <body style="margin: 0;">
            <div id="graphiql" style="height: 100vh;"></div>
            <script crossorigin src="https://unpkg.com/react/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/graphiql/graphiql.min.js"></script>
            <script>
              const fetcher = GraphiQL.createFetcher({
                url: '/api/graphql',
              });
              ReactDOM.render(
                React.createElement(GraphiQL, { fetcher }),
                document.getElementById('graphiql')
              );
            </script>
          </body>
        </html>
      `);
    });

    // GraphQL API endpoint
    app.use('/api/graphql', async (c, next) => {
      // Create GraphQL context with user info
      c.set('graphqlContext', {
        user: c.get('user'),
        c
      });
      c.set('honoCtx', c);
      await next();
    });

    app.post('/api/graphql', graphqlServer({
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

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

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

// Start the application
bootstrap();