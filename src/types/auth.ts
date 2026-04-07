import type { User } from './user';
export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
export type AuthContextType = {
  user: User | null;
  setUser: (data: User | null) => void;
  loading: boolean;
  error: string | null;
  fetchCurrentUser: () => Promise<void>;
};
