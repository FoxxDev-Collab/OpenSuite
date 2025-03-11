import type { User } from './graphql/context';

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
    jwtPayload: {
      id: string;
      email: string;
    };
  }
}