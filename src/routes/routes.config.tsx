import type { Role } from '@/types/auth';
import Dashboard from '@/pages/Dashboard';
import Leave from '@/pages/Leave';
import ManagerDashboard from '@/pages/ManagerDashboard';
export type AppRoute = {
  path: string;
  element: React.ReactNode;
  roles?: Role[];
};

export const APP_ROUTES: AppRoute[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/leave',
    element: <Leave />,
  },
  {
    path: '/manager-dashboard',
    element: <ManagerDashboard />,
    roles: ['MANAGER'],
  },
];
