import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import { LogoutButton } from './logout-button'
import { redirect } from 'next/navigation'

export async function UserNav() {
  const { status, body: user } = await api.auth.profile.query()

  if (status !== 200) {
    return
  }

  async function handleLogout() {
    'use server'
    cookies().set('psify@access_token', '', { expires: 0, maxAge: 0 })
    cookies().set('psify@refresh_token', '', { expires: 0, maxAge: 0 })
    redirect('/auth/sign-in')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 select-none rounded-full bg-primary/10"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name.toUpperCase().slice(0, 2)}
            </AvatarFallback>
            {/* <AvatarImage src={user} alt="" /> */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/schedules">Agendamentos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/billing">Assinaturas</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <LogoutButton handleClick={handleLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
