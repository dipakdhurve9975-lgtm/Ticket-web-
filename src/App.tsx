import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { ROUTES } from '@/config/routes';

// Layouts
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Pages (Assume these are all exported from their respective files)
import { LoginPage } from '@/pages/LoginPage';
import { UserDashboard } from '@/pages/UserDashboard';
import { CreateRequest } from '@/pages/CreateRequest';
import { MyRequests } from '@/pages/MyRequests';
import { TicketDetails } from '@/pages/TicketDetails';
import { AgentDashboard } from '@/pages/AgentDashboard';
import { PriorityQueue } from '@/pages/PriorityQueue';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Analytics } from '@/pages/Analytics';
import { ProfileSettings } from '@/pages/ProfileSettings';

// Route Guards
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-50">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
};

const RootRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    case 'AGENT':
      return <Navigate to={ROUTES.AGENT_DASHBOARD} replace />;
    default:
      return <UserDashboard />;
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              {/* Common Routes */}
              <Route path={ROUTES.DASHBOARD} element={<RootRedirect />} />
              <Route path={ROUTES.CREATE_REQUEST} element={<CreateRequest />} />
              <Route path={ROUTES.MY_REQUESTS} element={<MyRequests />} />
              <Route path={ROUTES.TICKET_DETAILS} element={<TicketDetails />} />
              <Route path={ROUTES.SETTINGS} element={<ProfileSettings />} />

              {/* Agent & Admin Routes */}
              <Route path={ROUTES.AGENT_DASHBOARD} element={
                <RoleRoute allowedRoles={['AGENT', 'ADMIN']}>
                  <AgentDashboard />
                </RoleRoute>
              } />
              <Route path={ROUTES.PRIORITY_QUEUE} element={
                <RoleRoute allowedRoles={['AGENT', 'ADMIN']}>
                  <PriorityQueue />
                </RoleRoute>
              } />

              {/* Admin Only Routes */}
              <Route path={ROUTES.ADMIN_DASHBOARD} element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              } />
              <Route path={ROUTES.ANALYTICS} element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <Analytics />
                </RoleRoute>
              } />
              
              {/* Catch-all */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
