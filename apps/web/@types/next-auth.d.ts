/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import NextAuth from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    accessToken: string
  }
  interface Session {
    user: {
      accessToken: string
      sub: string
      email: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
  }
}
