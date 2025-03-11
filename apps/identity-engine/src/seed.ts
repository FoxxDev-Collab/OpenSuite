import { hash } from 'bcrypt';
import { db } from '../src/database/db';
import { users, roles, permissions, userRoles, rolePermissions } from '../src/database/schema';
import { config } from 'dotenv';

// Load environment variables
config();

async function seed() {
  console.log('Starting seed process...');
  
  // Create default roles
  console.log('Creating roles...');
  const createdRoles = await db.insert(roles).values([
    { name: 'Admin', description: 'System administrator with full access' },
    { name: 'User', description: 'Standard user with limited access' }
  ]).returning();
  
  console.log(`Created ${createdRoles.length} roles`);
  
  // Map role names to IDs for easier reference
  const roleMap = createdRoles.reduce((map, role) => {
    map[role.name] = role.id;
    return map;
  }, {} as Record<string, number>);
  
  // Create permissions
  console.log('Creating permissions...');
  const permissionsToCreate = [
    // User management permissions
    { code: 'user:read', description: 'View user information', service: 'identity_engine' },
    { code: 'user:create', description: 'Create new users', service: 'identity_engine' },
    { code: 'user:update', description: 'Update existing users', service: 'identity_engine' },
    { code: 'user:delete', description: 'Delete users', service: 'identity_engine' },
    
    // Role management permissions
    { code: 'role:read', description: 'View roles', service: 'identity_engine' },
    { code: 'role:create', description: 'Create new roles', service: 'identity_engine' },
    { code: 'role:update', description: 'Update existing roles', service: 'identity_engine' },
    { code: 'role:delete', description: 'Delete roles', service: 'identity_engine' },
    
    // Permission management
    { code: 'permission:read', description: 'View permissions', service: 'identity_engine' },
    { code: 'permission:assign', description: 'Assign permissions to roles', service: 'identity_engine' }
  ];
  
  const createdPermissions = await db.insert(permissions).values(permissionsToCreate).returning();
  console.log(`Created ${createdPermissions.length} permissions`);
  
  // Map permission codes to IDs for easier reference
  const permissionMap = createdPermissions.reduce((map, permission) => {
    map[permission.code] = permission.id;
    return map;
  }, {} as Record<string, number>);
  
  // Assign permissions to roles
  console.log('Assigning permissions to roles...');
  
  // Admin gets all permissions
  const adminPermissions = createdPermissions.map(permission => ({
    roleId: roleMap['Admin'],
    permissionId: permission.id
  }));
  
  // Regular users only get basic permissions
  const userPermissions = [
    { roleId: roleMap['User'], permissionId: permissionMap['user:read'] }
  ];
  
  await db.insert(rolePermissions).values([...adminPermissions, ...userPermissions]);
  
  // Create admin user
  console.log('Creating admin user...');
  const passwordHash = await hash('Admin123!', 10);
  
  const [adminUser] = await db.insert(users).values({
    email: 'admin@opensuite.com',
    passwordHash,
    firstName: 'System',
    lastName: 'Administrator',
    emailVerified: true
  }).returning();
  
  console.log(`Created admin user: ${adminUser.email}`);
  
  // Assign admin role to admin user
  await db.insert(userRoles).values({
    userId: adminUser.id,
    roleId: roleMap['Admin']
  });
  
  console.log('Seed completed successfully!');
}

// Execute the seed function
seed()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });