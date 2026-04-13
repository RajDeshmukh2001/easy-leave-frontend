import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';

const Layout = (): React.JSX.Element => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full bg-gray-50">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
