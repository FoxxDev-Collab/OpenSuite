import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../database/db';
import { users, roles, userRoles } from '../database/schema';
import { compare, hash } from 'bcrypt';

const userRoutes = new Hono();

// Get current user
userRoutes.get('/me', async (c) => {
  const jwtPayload = c.get('jwtPayload');
  const userId = jwtPayload.sub;
  
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
      emailVerified: users.emailVerified,
      avatar: users.avatar
    })
    .from(users)
    .where(eq(users.id, userId));
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  // Get user roles
  const userRolesList = await db
    .select({
      roleId: userRoles.roleId,
      roleName: roles.name
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));
  
  // Format roles for response
  const formattedRoles = userRolesList.map(r => ({
    id: r.roleId,
    name: r.roleName
  }));
  
  return c.json({
    ...user,
    roles: formattedRoles
  });
});

// Update user schema
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional()
});

// Update current user
userRoutes.patch('/me', zValidator('json', updateUserSchema), async (c) => {
  const jwtPayload = c.get('jwtPayload');
  const userId = jwtPayload.sub;
  const updateData = c.req.valid('json');
  
  // Update user
  const [updated] = await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning();
  
  if (!updated) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  return c.json({
    message: 'User updated successfully',
    user: {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      avatar: updated.avatar
    }
  });
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8)
});

// Change password
userRoutes.post('/me/change-password', zValidator('json', changePasswordSchema), async (c) => {
  const jwtPayload = c.get('jwtPayload');
  const userId = jwtPayload.sub;
  const { currentPassword, newPassword } = c.req.valid('json');
  
  // Get user with password
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  // Verify current password
  const passwordValid = await compare(currentPassword, user.passwordHash);
  if (!passwordValid) {
    return c.json({ error: 'Current password is incorrect' }, 401);
  }
  
  // Hash new password
  const passwordHash = await hash(newPassword, 10);
  
  // Update password
  await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
  
  return c.json({ message: 'Password updated successfully' });
});

// Admin routes for user management - these would require admin role checking middleware
// ...

export { userRoutes };

function hash(newPassword: string, arg1: number) {
    throw new Error('Function not implemented.');
}
