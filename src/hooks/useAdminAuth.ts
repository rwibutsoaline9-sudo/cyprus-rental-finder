import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

export const useAdminAuth = () => {
  return useAdminAuthContext();
};
