"use client"

import { useState } from "react"
import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"

export default function SuggestPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    whyNobledark: "",
    tags: "",
    coverUrl: "",
    purchaseUrl: "",
    submittedBy: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.")
      return
    }
    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong.")
      }
    } catch {
      setError("Network error. Try again.")
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-900/30 flex items-center justify-center">
            <span className="text-3xl text-amber-500">✦</span>
          </div>
          <h1 className="font-serif text-2xl mb-3">Thanks for the recommendation</h1>
          <p className="text-stone-400 mb-8">
            It&apos;s been sent for review. If approved, it&apos;ll appear in the directory.
          </p>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-500 transition-colors font-mono uppercase tracking-wider"
          >
            ← Back to {SITE_NAME}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <nav className="border-b border-stone-800">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg text-stone-200 hover:text-amber-400 transition-colors">
            {SITE_NAME}
          </Link>
          <Link href="/books" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
            ← Directory
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-2xl px-6 pt-12 pb-24">
        <h1 className="font-serif text-3xl text-stone-100 mb-2">Suggest a Book</h1>
        <p className="text-stone-500 mb-10">
          Know a nobledark fantasy that belongs here? Drop it below. The community reviews every suggestion.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Title *</label>
              <input
                required
                value={form.title}
                onChange={handleChange("title")}
                placeholder="The Fall of Wolfsbane"
                className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Author *</label>
              <input
                required
                value={form.author}
                onChange={handleChange("author")}
                placeholder="Jon Cronshaw"
                className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Why It&apos;s Nobledark</label>
            <textarea
              value={form.whyNobledark}
              onChange={handleChange("whyNobledark")}
              placeholder="Briefly describe why this book fits the nobledark genre..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={handleChange("tags")}
              placeholder="epic, political, series"
              className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Cover Image URL</label>
              <input
                value={form.coverUrl}
                onChange={handleChange("coverUrl")}
                placeholder="https://..."
                className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Purchase Link</label>
              <input
                value={form.purchaseUrl}
                onChange={handleChange("purchaseUrl")}
                placeholder="https://geni.us/..."
                className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500">Your Name (optional)</label>
            <input
              value={form.submittedBy}
              onChange={handleChange("submittedBy")}
              placeholder="How should we credit you?"
              className="w-full mt-1 px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600 placeholder:text-stone-600"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:text-stone-500 text-stone-100 text-sm font-medium transition-colors"
          >
            {sending ? "Sending..." : "Submit Suggestion"}
          </button>
        </form>
      </section>
    </div>
  )
}