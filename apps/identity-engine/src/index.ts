import { Hono } from 'hono';
import { jwt } from 'hono/jwt';

const app = new Hono();

// Middleware
app.use('/api/*', jwt({
  secret: process.env.JWT_SECRET || 'development-secret'
}));

// Routes
app.get('/', (c) => c.text('Identity Engine API'));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default {
  port: 4000,
  fetch: app.fetch
};
