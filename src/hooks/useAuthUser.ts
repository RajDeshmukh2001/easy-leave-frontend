import AuthContext from '@/context/AuthContext';
import { useContext } from 'react';
import type { AuthContextType } from '@/types/auth';

const useAuthUser = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export default useAuthUser;
