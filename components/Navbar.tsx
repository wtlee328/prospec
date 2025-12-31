import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { getApifyUsage } from '@/lib/apify'
import { LogOut, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavLinks } from './NavLinks'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let balance = 0
  let isApifyBalance = false
  
  try {
    const usage = await getApifyUsage()
    const limit = usage?.limitUsd || 0
    const used = usage?.usageTotalUsd || 0
    balance = Math.max(0, limit - used)
    isApifyBalance = true
  } catch (err) {
    console.error('Failed to fetch Apify usage:', err)
  }



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Prospec" className="h-7 w-auto" />
          </Link>
        </div>

        {user && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <NavLinks />
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-secondary/30",
                !isApifyBalance && "opacity-50"
              )}>
                <Wallet className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tabular-nums">
                  {isApifyBalance ? `$${balance.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              
              <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full px-5">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
