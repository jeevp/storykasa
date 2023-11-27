import { createContextProvider } from '../createContextProvider';
import useAdminState from './useAdminState';

export const [AdminProvider, useAdmin] = createContextProvider(useAdminState);
