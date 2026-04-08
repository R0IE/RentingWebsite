"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin() {
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      return
    }

    if (result?.ok) {
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />

      <Button onClick={handleLogin}>
        Login
      </Button>
    </div>
  )
}