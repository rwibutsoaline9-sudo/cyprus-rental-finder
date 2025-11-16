import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Building2,
  Eye,
  Star,
  Users,
  Settings,
  Home,
  Megaphone,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: BarChart3, exact: true },
  { title: 'Properties', url: '/admin/properties', icon: Building2 },
  { title: 'Advertisements', url: '/admin/advertisements', icon: Megaphone },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Visitors', url: '/admin/visitors', icon: Eye },
  { title: 'Property Views', url: '/admin/views', icon: Star },
  { title: 'Ratings', url: '/admin/ratings', icon: Star },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {!collapsed && 'Rental Admin'}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: navIsActive }) => {
                        const active = item.exact 
                          ? isActive(item.url, true)
                          : navIsActive;
                        return active 
                          ? 'bg-accent text-accent-foreground font-medium' 
                          : 'hover:bg-accent/50';
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};