import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import Leave from '@/pages/Leave';
import Dashboard from '@/pages/Dashboard';
import Home from '@/components/Home';
import ProtectedRoute from './ProtectedRoute';
import type React from 'react';
import PublicRoute from './PublicRoute';

const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leave" element={<Leave />} />
      </Route>

      <Route
        index
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
