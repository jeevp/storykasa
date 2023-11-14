// AuthContext.ts
import { createContextProvider } from '../createContextProvider';
import useAuthState from './useAuthState';

export const [AuthProvider, useAuth] = createContextProvider(useAuthState);
