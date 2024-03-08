'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Input } from './input'
import { Button } from './button'
import { Eye, EyeOff } from 'lucide-react'

export interface InputPasswordProp
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProp>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="flex relative">
        <Input
          className={cn(className)}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          {...props}
        />
        <Button
          className="absolute top-1 right-1 size-7 p-0"
          variant="ghost"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="size-3" />
          ) : (
            <Eye className="size-3" />
          )}
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
    )
  },
)
InputPassword.displayName = 'InputPassword'

export { InputPassword }
