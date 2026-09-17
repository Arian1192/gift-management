import { Home, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
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
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        className="group-data-[collapsible=icon]:!justify-center"
      >
        <Link to={to} aria-current={isActive ? 'page' : undefined}>
          <Icon aria-hidden={true} />
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ session, onSignOut }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" aria-label="Primary navigation">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1 group-data-[state=collapsed]:justify-center">
          <div className="flex flex-col group-data-[state=collapsed]:hidden">
            <p className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70">Gift Management</p>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Workspace</h1>
          </div>
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
