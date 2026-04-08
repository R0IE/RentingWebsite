import prisma from "@/lib/prisma" 
import bcrypt from "bcrypt"


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400
      })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed
      }
    })

    return new Response(JSON.stringify({ id: user.id, email: user.email }), {
      status: 201
    })
  } catch (err: any) {
    console.error(err)
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500
    })
  }
}