import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { EMPLOYEE_NAV_ITEMS, MANAGER_NAV_ITEMS } from '@/constants/navigation';
import useAuthUser from '@/hooks/useAuthUser';
import type { NavItem } from '@/types/navigation';
import { CalendarDays } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AppSidebar = (): React.JSX.Element => {
  const { user } = useAuthUser();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 items-center p-3 border-b border-b-gray-700">
          <div className="rounded-lg bg-(--technogise-blue) p-1">
            <CalendarDays color="white" className="p-1" />
          </div>
          <h1 className="text-lg text-white font-bold">EasyLeave</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] tracking-widest">
            Employee
          </SidebarGroupLabel>

          {EMPLOYEE_NAV_ITEMS.map((item: NavItem) => (
            <SidebarMenuItem key={item.name}>
              <NavLink to={item.href}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive} className="cursor-pointer mb-1">
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}

          {user?.role === 'MANAGER' && (
            <>
              <SidebarGroupLabel className="text-gray-500 uppercase text-[10px] tracking-widest">
                Manager
              </SidebarGroupLabel>

              {MANAGER_NAV_ITEMS.map((item: NavItem) => (
                <SidebarMenuItem key={item.name}>
                  <NavLink to={item.href}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} className="cursor-pointer mb-1">
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
