import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signInAsAdmin = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if user exists in admin_users table first
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (adminError || !adminData) {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return false;
      }

      // Try to sign in with Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }

      setAdminUser(adminData);
      
      toast({
        title: "Welcome",
        description: `Signed in as ${adminData.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Admin sign in error:', error);
      toast({
        title: "Error",
        description: "Failed to sign in",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAdminUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      // Non-blocking: don't toggle global loading for this quick check
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminData) {
          setAdminUser(adminData);
        } else {
          await supabase.auth.signOut();
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    // Listen for auth state changes FIRST (sync-only actions in callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
      }
      if (event === 'SIGNED_IN' && session?.user?.email) {
        // Defer any Supabase calls to avoid deadlocks
        setTimeout(async () => {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user!.email!)
            .maybeSingle();
          if (adminData) {
            setAdminUser(adminData);
          } else {
            await supabase.auth.signOut();
            setAdminUser(null);
          }
        }, 0);
      }
    });

    // THEN check for existing session
    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    adminUser,
    loading,
    signInAsAdmin,
    signOut,
    isAdmin: !!adminUser,
  };
};