import Link from 'next/link'
import { LogoIcon } from './logo'
import { Separator } from './ui/separator'
// import { TeamSwitcher } from './team-switcher'
import { Button } from './ui/button'
import { UserNav } from './user-nav'
import { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'
import { NavLink } from './nav-link'

export function Header() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <LogoIcon className="h-8 w-8" />
        </Link>

        {/* <TeamSwitcher /> */}

        <Separator orientation="vertical" className="h-5" />

        <nav className="flex items-center space-x-6">
          <NavLink href="/psychologists">Psicólogos</NavLink>
          <NavLink href="/schedules">Agendamentos</NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          Feedback
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <nav className="flex items-center space-x-6">
          <NavLink className="text-xs font-normal" href="/changelog">
            Changelog
          </NavLink>
          <NavLink className="text-xs font-normal" href="/help">
            Ajuda
          </NavLink>
          <NavLink className="text-xs font-normal" href="/faq">
            FAQ
          </NavLink>
        </nav>

        <Separator orientation="vertical" className="h-5" />

        {/* <Notifications /> */}

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <UserNav />
        </Suspense>
      </div>
    </div>
  )
}
