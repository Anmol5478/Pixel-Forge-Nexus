import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProjectDetails from './components/projects/ProjectDetails';
import UserManagement from './components/admin/UserManagement';
import AccountSettings from './components/auth/AccountSettings';
import Navbar from './components/layout/Navbar';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <main className={user ? 'pt-16' : ''}>
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" /> : <Login />
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/projects/:projectId" element={
              <PrivateRoute>
                <ProjectDetails />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } />
            <Route path="/account" element={
              <PrivateRoute>
                <AccountSettings />
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
