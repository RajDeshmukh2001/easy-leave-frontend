import { CalendarPlus, LayoutDashboard } from 'lucide-react';
import type { NavItem } from '../types/navigation';
export const EMPLOYEE_NAV_ITEMS: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      name: "Leave",
      icon: CalendarPlus,
      href: "/leave",
    }
]
export const MANAGER_NAV_ITEMS: NavItem[] = [
    {
      name: "Manager Dashboard",
      icon: LayoutDashboard,
      href: "/manager-dashboard",
    }
]