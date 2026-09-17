import * as React from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext({ open: true })

export function SidebarProvider({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SidebarContext.Provider value={{ open: true }}>
      <div className={cn('flex min-h-screen w-full bg-muted/40', className)} {...props}>{children}</div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn('hidden w-64 shrink-0 border-r bg-background p-4 md:flex md:flex-col', className)}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-6 space-y-1', className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-1 flex-col gap-2', className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('space-y-1', className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={className} {...props} />
}

export function SidebarMenuButton({ className, isActive, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) {
  return (
    <a
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        className
      )}
      {...props}
    />
  )
}

export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <main className={cn('flex min-w-0 flex-1 flex-col', className)} {...props} />
}
