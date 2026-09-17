import { Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navigationItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Profile', to: '/profile', icon: User }
]

export function AppSidebar() {
  return (
    <Sidebar aria-label="Primary navigation">
      <SidebarHeader>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Gift Management</p>
        <h1 className="text-xl font-semibold">Workspace</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
