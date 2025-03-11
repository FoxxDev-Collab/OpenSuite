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

    const roleRepository = AppDataSource.getRepository(Role);
    const permissionRepository = AppDataSource.getRepository(Permission);
    const userRepository = AppDataSource.getRepository(User);
    
    // Create default roles if they don't exist
    let adminRole = await roleRepository.findOneBy({ name: 'admin' });
    if (!adminRole) {
      adminRole = new Role();
      adminRole.name = 'admin';
      adminRole.description = 'System administrator with full access';
      await roleRepository.save(adminRole);
      console.log('Created admin role');
    }

    let userRole = await roleRepository.findOneBy({ name: 'user' });
    if (!userRole) {
      userRole = new Role();
      userRole.name = 'user';
      userRole.description = 'Standard user with basic access';
      await roleRepository.save(userRole);
      console.log('Created user role');
    }

    // Create default permissions if they don't exist
    let userReadPerm = await permissionRepository.findOneBy({ code: 'user:read' });
    if (!userReadPerm) {
      userReadPerm = new Permission();
      userReadPerm.code = 'user:read';
      userReadPerm.description = 'Can read user information';
      userReadPerm.service = 'identity';
      await permissionRepository.save(userReadPerm);
      console.log('Created user:read permission');
    }

    let userWritePerm = await permissionRepository.findOneBy({ code: 'user:write' });
    if (!userWritePerm) {
      userWritePerm = new Permission();
      userWritePerm.code = 'user:write';
      userWritePerm.description = 'Can create and modify users';
      userWritePerm.service = 'identity';
      await permissionRepository.save(userWritePerm);
      console.log('Created user:write permission');
    }

    // Assign permissions to roles if not already assigned
    adminRole = await roleRepository.findOne({
      where: { name: 'admin' },
      relations: ['permissions']
    });
    
    if (adminRole && userReadPerm && userWritePerm) {
      if (!adminRole.permissions || adminRole.permissions.length === 0) {
        adminRole.permissions = [userReadPerm, userWritePerm];
        await roleRepository.save(adminRole);
        console.log('Assigned permissions to admin role');
      }
    }

    userRole = await roleRepository.findOne({
      where: { name: 'user' },
      relations: ['permissions']
    });
    
    if (userRole && userReadPerm) {
      if (!userRole.permissions || userRole.permissions.length === 0) {
        userRole.permissions = [userReadPerm];
        await roleRepository.save(userRole);
        console.log('Assigned permissions to user role');
      }
    }

    // Create admin user if it doesn't exist
    let adminUser = await userRepository.findOneBy({ email: 'admin@opensuite.com' });
    if (!adminUser && adminRole) {
      adminUser = new User();
      adminUser.email = 'admin@opensuite.com';
      adminUser.passwordHash = await hash('Admin123!', 10);
      adminUser.firstName = 'Admin';
      adminUser.lastName = 'User';
      adminUser.emailVerified = true;
      adminUser.active = true;
      adminUser.roles = [adminRole];
      await userRepository.save(adminUser);
      console.log('Created admin user');
    }

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