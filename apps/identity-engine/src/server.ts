import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';

// Load environment variables
config();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use(cors());
app.use('/api/*', async (c, next) => {
  // Skip JWT validation for auth routes
  if (c.req.path.startsWith('/api/auth/')) {
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

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);

// Start the server
const port = parseInt(process.env.PORT || '4000');
console.log(`Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port
});

console.log(`Server running at http://localhost:${port}`);