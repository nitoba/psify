import { Ribbon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export function Logo({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-foreground rounded px-5 py-3 flex items-center justify-center gap-2',
        className,
      )}
      {...props}
    >
      <h2 className="text-4xl font-bold text-background">Psyfi</h2>
      <Ribbon className="text-background size-8" />
    </div>
  )
}

export function LogoIcon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-foreground rounded size-10 flex items-center justify-center',
        className,
      )}
      {...props}
    >
      <Ribbon className="text-background size-5" />
    </div>
  )
}
