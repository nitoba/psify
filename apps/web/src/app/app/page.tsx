'use client'

import { api } from '@/lib/api'

export default function Page() {
  const { data } = api.auth.profile.useQuery(['profile'])

  return (
    <div>
      <pre>{JSON.stringify(data?.body, null, 2)}</pre>
    </div>
  )
}
