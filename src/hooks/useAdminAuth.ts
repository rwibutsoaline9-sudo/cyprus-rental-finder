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
      
      // Check if user exists in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError || !adminData) {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return false;
      }

      // For demo purposes, we'll accept any password for the admin user
      // In production, you should verify the password hash
      setAdminUser(adminData);
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      
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

  const signOut = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
    toast({
      title: "Signed out",
      description: "You have been signed out",
    });
  };

  const checkAdminStatus = async () => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const adminData = JSON.parse(stored);
        setAdminUser(adminData);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      localStorage.removeItem('admin_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return {
    adminUser,
    loading,
    signInAsAdmin,
    signOut,
    isAdmin: !!adminUser,
  };
};