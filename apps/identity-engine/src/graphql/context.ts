import type { Context as HonoContext } from 'hono';

export interface User {
  id: string;
  email: string;
}

export interface Context {
  user?: User;
  c: HonoContext;
}

export const createContext = (c: HonoContext): Context => {
  const user = c.get('user');
  return { user, c };
};