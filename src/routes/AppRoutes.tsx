import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import ProtectedRoute from './ProtectedRoute';
import type React from 'react';
import PublicRoute from './PublicRoute';
import { APP_ROUTES } from './routes.config';

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
        {APP_ROUTES.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>}
          />
        ))}
      </Route>

      <Route
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
