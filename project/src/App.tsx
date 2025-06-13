import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { Loading } from './components/ui/Loading';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const OperatorDashboard = lazy(() => import('./pages/operator/OperatorDashboard'));
const FlowmeterUpload = lazy(() => import('./pages/operator/FlowmeterUpload'));
const WaterQualityUpload = lazy(() => import('./pages/operator/WaterQualityUpload'));
const HistoryPage = lazy(() => import('./pages/operator/HistoryPage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const SitesManagement = lazy(() => import('./pages/admin/SitesManagement'));
const OperatorManagement = lazy(() => import('./pages/admin/OperatorManagement'));
const AlertsManagement = lazy(() => import('./pages/admin/AlertsManagement'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Operator Routes */}
          <Route element={<ProtectedRoute allowedRoles={['operator', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/operator" element={<OperatorDashboard />} />
              <Route path="/operator/flowmeter" element={<FlowmeterUpload />} />
              <Route path="/operator/water-quality" element={<WaterQualityUpload />} />
              <Route path="/operator/history" element={<HistoryPage />} />
            </Route>
          </Route>
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/sites" element={<SitesManagement />} />
              <Route path="/admin/operators" element={<OperatorManagement />} />
              <Route path="/admin/alerts" element={<AlertsManagement />} />
            </Route>
          </Route>
          
          {/* Redirect to login or dashboard based on auth status */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;