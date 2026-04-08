"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleRegister() {
    setError("")
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || "Failed to register")
        return
      }

      router.push("/login")
    } catch (err) {
      setError("Something went wrong")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {error && <p className="text-red-500">{error}</p>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleRegister}>Register</Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}