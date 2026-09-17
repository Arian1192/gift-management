import { Home, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/NavUser'

const navigationItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Profile', to: '/profile', icon: User },
]

type AppSidebarProps = {
  session: Session
  onSignOut: () => void
}

function SidebarNavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: true }>
  label: string
}) {
  const { pathname } = useLocation()
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link to={to} aria-current={isActive ? 'page' : undefined}>
          <Icon aria-hidden={true} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ session, onSignOut }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" aria-label="Primary navigation">
      <SidebarHeader>
        <div className="flex flex-col px-2 py-1 group-data-[state=collapsed]:hidden">
          <p className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70">Gift Management</p>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Workspace</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarNavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
