import { logout } from '@/api/auth.api';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ADMIN_NAV_ITEMS, EMPLOYEE_NAV_ITEMS, MANAGER_NAV_ITEMS } from '@/constants/navigation';
import useAuthUser from '@/hooks/useAuthUser';
import type { NavItem } from '@/types/navigation';
import { CalendarDays, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SidebarLogo } from './SidebarLogo';
import { useSidebar } from '@/hooks/use-sidebar';
import toast from 'react-hot-toast';
import UserProfile from './UserProfile';

const NavItemLink = ({ item }: { item: NavItem }): React.JSX.Element => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <NavLink to={item.href} onClick={() => setOpenMobile(false)}>
        {({ isActive }) => (
          <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
            <span className="flex items-center gap-2">
              <item.icon />
              <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
            </span>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
};

export const AppSidebar = (): React.JSX.Element => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Something went wrong. Please try again');
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogo title="EasyLeave" logo={<CalendarDays />} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] tracking-widest group-data-[collapsible=icon]:hidden">
            Employee
          </SidebarGroupLabel>

          <SidebarMenu>
            {EMPLOYEE_NAV_ITEMS.map((item) => (
              <NavItemLink key={item.href} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {user?.role === 'MANAGER' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] tracking-widest group-data-[collapsible=icon]:hidden">
              Manager
            </SidebarGroupLabel>

            <SidebarMenu>
              {MANAGER_NAV_ITEMS.map((item) => (
                <NavItemLink key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {user?.role === 'ADMIN' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] tracking-widest group-data-[collapsible=icon]:hidden">
              Admin
            </SidebarGroupLabel>

            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item) => (
                <NavItemLink key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>
            <UserProfile name={user?.name} email={user?.email} />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-center flex cursor-pointer px-2 py-4 border border-white/20"
            >
              <span className="group-data-[collapsible=icon]:hidden w-full font-semibold">
                Logout
              </span>
              <LogOut className="text-sidebar-accent-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
