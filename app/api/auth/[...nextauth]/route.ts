import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials!.password, user.password)

        if (!valid) return null

        return { id: String(user.id), email: user.email, name: user.name }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).id) token.id = (user as any).id
      return token
    },
    async session({ session, token }) {
      if (token && (token as any).id) (session.user as any).id = (token as any).id
      return session
    }
  },
  pages: {
    signIn: "/login", 
  }
})

export { handler as GET, handler as POST }