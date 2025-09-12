import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2, Home, ArrowLeft, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AdminAuthFormData {
  email: string;
  password: string;
}

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { adminUser, signInAsAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<AdminAuthFormData>();

  // Redirect authenticated admins to admin dashboard
  useEffect(() => {
    if (adminUser) {
      navigate('/admin');
    }
  }, [adminUser, navigate]);

  const onSignIn = async (data: AdminAuthFormData) => {
    setIsLoading(true);
    const success = await signInAsAdmin(data.email, data.password);
    if (success) {
      navigate('/admin');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <Home className="h-6 w-6" />
              <div>
                <h1 className="text-xl font-bold">Cyprus Rental Finder</h1>
                <p className="text-sm text-primary-foreground/80">Admin Portal</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Sign in with your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cyprus-rentals.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  {...register('password', { 
                    required: 'Password is required'
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In as Admin
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: admin@cyprus-rentals.com</p>
              <p>Password: any password</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;