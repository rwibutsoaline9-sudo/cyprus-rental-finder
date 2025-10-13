import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextValue {
  adminUser: AdminUser | null;
  loading: boolean;
  signInAsAdmin: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signInAsAdmin = async (email: string, password: string) => {
    try {
      setLoading(true);
      // 1) Sign in with Supabase Auth first
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
        return false;
      }

      // 2) Verify admin access
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        toast({
          title: 'Access Denied',
          description: 'Your account does not have admin access.',
          variant: 'destructive',
        });
        setAdminUser(null);
        return false;
      }

      setAdminUser(adminData as AdminUser);
      toast({ title: 'Welcome', description: `Signed in as ${adminData.name}` });
      return true;
    } catch (err) {
      console.error('Admin sign in error:', err);
      toast({ title: 'Error', description: 'Failed to sign in', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAdminUser(null);
      toast({ title: 'Signed out', description: 'You have been signed out' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();
        if (adminData) {
          setAdminUser(adminData as AdminUser);
        } else {
          await supabase.auth.signOut();
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Subscribe to auth changes (sync-only updates in callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setLoading(false);
      }
      if (event === 'SIGNED_IN' && session?.user?.email) {
        setLoading(true);
        setTimeout(async () => {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user!.email!)
            .maybeSingle();
          if (adminData) {
            setAdminUser(adminData as AdminUser);
          } else {
            await supabase.auth.signOut();
            setAdminUser(null);
          }
          setLoading(false);
        }, 0);
      }
    });

    // Initial check
    checkAdminStatus();

    return () => subscription.unsubscribe();
  }, []);

  const value: AdminAuthContextValue = {
    adminUser,
    loading,
    signInAsAdmin,
    signOut,
    isAdmin: !!adminUser,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  return ctx;
};

export { AdminAuthContext };