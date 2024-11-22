import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authConfig } from "./auth.config"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "./data/account"
import { prismadb } from "./lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async signIn({  account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email
        session.user.id = token.id as string
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.id = existingUser.id
      return token
    },
  },
})