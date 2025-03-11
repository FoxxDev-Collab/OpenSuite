import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { Role } from '../database/entities/Role';
import { Permission } from '../database/entities/Permission';
import { Context } from './context';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, ctx: Context) => {
      if (!ctx.user) return null;
      return await AppDataSource.getRepository(User).findOne({
        where: { id: ctx.user.id },
        relations: ['roles', 'roles.permissions']
      });
    },

    user: async (_: any, { id }: { id: string }) => {
      return await AppDataSource.getRepository(User).findOne({
        where: { id },
        relations: ['roles', 'roles.permissions']
      });
    },

    users: async (_: any, { offset, limit }: { offset: number; limit: number }) => {
      return await AppDataSource.getRepository(User).find({
        skip: offset,
        take: limit,
        relations: ['roles']
      });
    },

    role: async (_: any, { id }: { id: string }) => {
      return await AppDataSource.getRepository(Role).findOne({
        where: { id: parseInt(id) },
        relations: ['permissions']
      });
    },

    roles: async () => {
      return await AppDataSource.getRepository(Role).find({
        relations: ['permissions']
      });
    },

    permissions: async () => {
      return await AppDataSource.getRepository(Permission).find();
    }
  },

  Mutation: {
    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { email: input.email },
        relations: ['roles', 'roles.permissions']
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const validPassword = await compare(input.password, user.passwordHash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      const token = sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'development-secret',
        { expiresIn: '1d' }
      );

      return {
        token,
        user
      };
    },

    createUser: async (_: any, { input }: { input: { email: string; password: string; firstName?: string; lastName?: string } }) => {
      const userRepository = AppDataSource.getRepository(User);
      const passwordHash = await hash(input.password, 10);
      
      const user = userRepository.create({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName
      });

      return await userRepository.save(user);
    },

    updateUser: async (_: any, { id, input }: { id: string; input: { email?: string; firstName?: string; lastName?: string; active?: boolean; avatar?: string } }) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });
      
      if (!user) {
        throw new Error('User not found');
      }

      userRepository.merge(user, input);
      return await userRepository.save(user);
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      const userRepository = AppDataSource.getRepository(User);
      const result = await userRepository.delete(id);
      return result.affected ? true : false;
    },

    assignRole: async (_: any, { userId, roleId }: { userId: string; roleId: string }) => {
      const userRepository = AppDataSource.getRepository(User);
      const roleRepository = AppDataSource.getRepository(Role);

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      const role = await roleRepository.findOneBy({ id: parseInt(roleId) });
      if (!role) {
        throw new Error('Role not found');
      }

      user.roles = [...(user.roles || []), role];
      return await userRepository.save(user);
    },

    removeRole: async (_: any, { userId, roleId }: { userId: string; roleId: string }) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      user.roles = user.roles.filter(role => role.id !== parseInt(roleId));
      return await userRepository.save(user);
    }
  },

  User: {
    roles: async (parent: User) => {
      if (parent.roles) {
        return parent.roles;
      }
      
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: parent.id },
        relations: ['roles']
      });
      
      return user?.roles || [];
    }
  },

  Role: {
    permissions: async (parent: Role) => {
      if (parent.permissions) {
        return parent.permissions;
      }
      
      const role = await AppDataSource.getRepository(Role).findOne({
        where: { id: parent.id },
        relations: ['permissions']
      });
      
      return role?.permissions || [];
    }
  }
};