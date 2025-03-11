import { hash } from 'bcrypt';
import { AppDataSource } from './database/data-source';
import { User } from './database/entities/User';
import { Role } from './database/entities/Role';
import { Permission } from './database/entities/Permission';

export async function seed() {
  console.log('Seeding database...');

  try {
    // Initialize database connection if not initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Create default roles
    const adminRole = new Role();
    adminRole.name = 'admin';
    adminRole.description = 'System administrator with full access';
    await AppDataSource.manager.save(adminRole);

    const userRole = new Role();
    userRole.name = 'user';
    userRole.description = 'Standard user with basic access';
    await AppDataSource.manager.save(userRole);

    // Create default permissions
    const userReadPerm = new Permission();
    userReadPerm.code = 'user:read';
    userReadPerm.description = 'Can read user information';
    userReadPerm.service = 'identity';
    await AppDataSource.manager.save(userReadPerm);

    const userWritePerm = new Permission();
    userWritePerm.code = 'user:write';
    userWritePerm.description = 'Can create and modify users';
    userWritePerm.service = 'identity';
    await AppDataSource.manager.save(userWritePerm);

    // Assign permissions to roles
    adminRole.permissions = [userReadPerm, userWritePerm];
    userRole.permissions = [userReadPerm];
    
    await AppDataSource.manager.save([adminRole, userRole]);

    // Create admin user
    const adminUser = new User();
    adminUser.email = 'admin@opensuite.com';
    adminUser.passwordHash = await hash('Admin123!', 10);
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.emailVerified = true;
    adminUser.active = true;
    adminUser.roles = [adminRole];

    await AppDataSource.manager.save(adminUser);

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@opensuite.com / Admin123!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch(console.error).finally(() => {
    AppDataSource.destroy();
  });
}