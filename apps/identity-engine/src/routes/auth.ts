import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../database/db';
import { users, refreshTokens } from '../database/schema';
import { randomUUID } from 'crypto';

const authRoutes = new Hono();

// User login schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Register schema validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional()
});

// Login route
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  // Find the user
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Verify password
  const passwordValid = await compare(password, user.passwordHash);
  if (!passwordValid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Generate tokens
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  
  const refreshToken = randomUUID();
  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
  
  // Store refresh token
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshExpiry
  });
  
  // Update last login
  await db
    .update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, user.id));
  
  return c.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
});

// Register route
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, firstName, lastName } = c.req.valid('json');
  
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    return c.json({ error: 'User already exists' }, 409);
  }
  
  // Hash password
  const passwordHash = await hash(password, 10);
  
  // Create user
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    firstName,
    lastName
  }).returning();
  
  return c.json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  }, 201);
});

// Refresh token route
authRoutes.post('/refresh', async (c) => {
  const { refreshToken } = await c.req.json();
  
  if (!refreshToken) {
    return c.json({ error: 'Refresh token is required' }, 400);
  }
  
  // Find the refresh token
  const [token] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));
  
  if (!token || token.revokedAt || new Date() > token.expiresAt) {
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
  
  // Get the user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, token.userId));
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  // Generate new access token
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  
  return c.json({ accessToken });
});

// Logout route
authRoutes.post('/logout', async (c) => {
  const { refreshToken } = await c.req.json();
  
  if (refreshToken) {
    // Revoke the refresh token
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.token, refreshToken));
  }
  
  return c.json({ message: 'Logged out successfully' });
});

export { authRoutes };