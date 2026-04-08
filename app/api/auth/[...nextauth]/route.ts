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
  pages: {
    signIn: "/login", 
  }
})

export { handler as GET, handler as POST }