import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/config/constants';
import { LayoutDashboard } from 'lucide-react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-900 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-white -top-20 -left-20 blur-3xl"></div>
          <div className="absolute w-96 h-96 rounded-full bg-white bottom-20 -right-20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/10 p-4 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <LayoutDashboard className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">{APP_NAME}</h1>
          <p className="text-xl text-brand-100 max-w-md mx-auto leading-relaxed">
            Enterprise service desk solution for intelligent issue resolution and support management.
          </p>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};
