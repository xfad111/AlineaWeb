import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReportsProvider } from './contexts/ReportsContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReportList from './pages/ReportList';
import CreateReport from './pages/CreateReport';
import EditReport from './pages/EditReport';
import ViewReport from './pages/ViewReport';
import UserManagement from './pages/UserManagement';
import ReportSummary from './pages/ReportSummary';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <ReportList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports/view/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ViewReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports/summary" element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <ReportSummary />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ReportsProvider>
    </AuthProvider>
  );
}

export default App;