'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LoginButton() {
  const { refresh } = useRouter()
  async function handleSignIn() {
    const res = await signIn('credentials', {
      redirect: false,
      email: 'psy_bruno@gmail.com',
      password: '12345678',
      type: 'psychologist',
    })

    if (res?.error) {
      alert(res.status)
    } else {
      refresh()
    }
  }
  return (
    <div>
      <Button onClick={handleSignIn}>Sign In</Button>
    </div>
  )
}
