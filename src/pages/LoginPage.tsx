import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AnimatedPage } from '@/components/AnimatedPage';
export function LoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      if (login(password)) {
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        toast.error('Invalid password.');
        setIsLoading(false);
      }
    }, 500);
  };
  return (
    <AppLayout>
      <AnimatedPage>
        <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
              <CardDescription>Enter the password to access the admin dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  (Hint: the password is `admin`)
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}