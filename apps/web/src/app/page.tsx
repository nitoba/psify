import { auth } from '@/auth'
import { LoginButton } from './login'

export default async function Page() {
  const session = await auth()

  if (!session) {
    return (
      <div>
        <LoginButton />
      </div>
    )
  }

  return (
    <main>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </main>
  )
}
