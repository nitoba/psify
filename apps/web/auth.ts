/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthConfig } from 'next-auth'
import { credentials } from '@/lib/auth/credentials'

const config = {
  providers: [credentials],
  callbacks: {
    jwt: async ({ token, user }) => {
      // first call
      if (user) {
        return {
          ...token,
          ...user,
        }
      }

      return token
    },

    session: ({ token, session }) => {
      session.user.email = token.email as string
      session.user.name = token.email
      session.user.image = token.image as string
      session.user.id = token.sub as string
      session.user.accessToken = token.accessToken

      return session
    },
  },
} satisfies NextAuthConfig

export const { auth, handlers, signIn, signOut } = NextAuth(config)
