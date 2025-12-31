'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Database, History, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crawl', label: 'New Crawl', icon: Search },
    { href: '/runs', label: 'Recent Runs', icon: History },
    { href: '/leads', label: 'Leads Database', icon: Database },
  ]

  return (
    <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary/30 rounded-lg border border-border/50">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
              isActive 
                ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
