import { getAuthenticatedUser } from '@/api/auth.api';
import type { AuthContextType } from '@/types/auth';
import type { User } from '@/types/user';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  error: null,
  fetchCurrentUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAuthenticatedUser();
      setUser(data);
    } catch (err: unknown) {
      setUser(null);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
