import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/theme-switcher'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="ml-auto pr-10 pt-8">
        <ModeToggle />
      </header>
      <div className="flex flex-col items-center justify-center bg-background my-auto">
        <Logo className="mb-8" />
        {children}
      </div>
    </main>
  )
}
