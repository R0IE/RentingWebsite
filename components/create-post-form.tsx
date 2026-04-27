"use client"

import { useState } from "react"

export default function CreatePostForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Title"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  )
}