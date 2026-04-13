import * as React from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type Props = {
  title: string;
  logo: React.ReactNode;
};

export const SidebarLogo = ({ title, logo }: Props): React.JSX.Element => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center">
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            {logo}
          </div>

          <span className="font-semibold text-sm truncate group-data-[collapsible=icon]:hidden">
            {title}
          </span>
        </SidebarMenuButton>
        <SidebarTrigger className="cursor-pointer" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
