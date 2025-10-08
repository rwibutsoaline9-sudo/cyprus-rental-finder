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
  const [loading, setLoading] = useState(true);
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

      // If auth fails, try to sign up the admin user automatically (for demo purposes)
      if (authError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              name: adminData.name,
              role: adminData.role
            }
          }
        });

        if (signUpError) {
          toast({
            title: "Authentication Failed",
            description: signUpError.message,
            variant: "destructive",
          });
          return false;
        }

        // Auto-confirm for demo purposes - sign in again
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (secondSignInError) {
          toast({
            title: "Setup Required",
            description: "Please check your email to confirm your account",
          });
          return false;
        }
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
      setLoading(true);
      
      // Check if user is authenticated with Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        // Check if the authenticated user is an admin
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (!error && adminData) {
          setAdminUser(adminData);
        } else {
          // User is authenticated but not an admin, sign them out
          await supabase.auth.signOut();
          setAdminUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
      } else if (event === 'SIGNED_IN' && session?.user?.email) {
        // Verify admin status when signed in
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminData) {
          setAdminUser(adminData);
        }
      }
    });

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