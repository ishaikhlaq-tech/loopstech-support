import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@utils/constants';
import { useAuth } from '../context/AuthContext';
import Login from '@pages/auth/Login';
import Dashboard from '@pages/dashboard/Dashboard';
import Tickets from '@pages/tickets/Tickets';
import SLAManager from '@pages/sla/SLAManager';
import CannedResponsesPage from '@pages/CannedResponses/CannedResponsesPage';
import TeamDirectoryPage from '@pages/TeamDirectory/TeamDirectoryPage';
import CompanySettingsPage from '@pages/CompanySettings/CompanySettingsPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  const isAdmin = (user?.app_role || user?.role) === 'admin';
  if (!isAdmin) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
        {/* Protected Routes */}
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path={ROUTES.TICKETS} element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path={ROUTES.SLA_MANAGER} element={<ProtectedRoute><SLAManager /></ProtectedRoute>} />
        <Route path={ROUTES.CANNED_RESPONSES} element={<ProtectedRoute><CannedResponsesPage /></ProtectedRoute>} />
        <Route path={ROUTES.TEAM} element={<ProtectedRoute><TeamDirectoryPage /></ProtectedRoute>} />
        <Route path={ROUTES.COMPANY_SETTINGS} element={<AdminProtectedRoute><CompanySettingsPage /></AdminProtectedRoute>} />
        
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
