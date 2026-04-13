import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ADMIN_NAV_ITEMS, EMPLOYEE_NAV_ITEMS, MANAGER_NAV_ITEMS } from '@/constants/navigation';
import useAuthUser from '@/hooks/useAuthUser';
import type { NavItem } from '@/types/navigation';
import { CalendarDays } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { SidebarLogo } from './SidebarLogo';

const NavItemLink = ({ item }: { item: NavItem }): React.JSX.Element => {
  return (
    <SidebarMenuItem>
      <NavLink to={item.href}>
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
  const { user } = useAuthUser();
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
            <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] text-xs tracking-widest group-data-[collapsible=icon]:hidden">
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
            <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] text-xs tracking-widest group-data-[collapsible=icon]:hidden">
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
    </Sidebar>
  );
};
