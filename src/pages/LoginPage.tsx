import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { DEPARTMENTS } from '@/config/constants';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await authService.register(name, email, password, department);
        await login(email, password);
      }
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setIsLogin(true);
  };

  return (
    <div className="w-full">
      <Card className="border border-surface-200/80 shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-2 border border-brand-200 mx-auto">
            <Sparkles className="w-6 h-6 text-brand-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-surface-900">
            {isLogin ? 'Sign In to ServiceDesk' : 'Create an Account'}
          </CardTitle>
          <p className="text-sm text-surface-500">
            {isLogin 
              ? 'Enter your credentials to access your support workspace'
              : 'Register to submit and track organizational requests'}
          </p>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8 pt-2">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">Full Name</label>
                  <Input
                    placeholder="e.g., Alex Chen"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">Department</label>
                  <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    options={DEPARTMENTS.map(dept => ({ value: dept, label: dept }))}
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">Email Address</label>
              <Input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-orange-glow transition-all"
            >
              {isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Quick Login Helpers */}
          <div className="mt-6 pt-5 border-t border-surface-100">
            <span className="text-xs font-medium text-surface-400 block mb-2.5 text-center">
              Quick Test Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@gmail.com', 'admin123')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.chen@enterprise.com', 'password')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-100 text-surface-800 text-xs font-medium hover:bg-surface-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-500" />
                <span>User Login</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-surface-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-bold text-brand-600 hover:text-brand-700 ml-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
