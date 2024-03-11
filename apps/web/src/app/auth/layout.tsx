import { Logo } from '@/components/logo'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-background">
      <Logo className="mb-8" />
      {children}
    </div>
  )
}
