import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export async function getSession() {
  const c = cookies()

  const token = c.get('psify@access_token')?.value

  if (!token) {
    return null
  }

  const decoded = jwtDecode<{ sub: string; email: string; role: string }>(token)

  return {
    user: {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    },
  }
}
