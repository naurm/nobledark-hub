"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"
import type { BookEntry } from "@/lib/books"

interface Suggestion {
  id: number
  title: string
  author: string
  whyNobledark: string
  tags: string[]
  coverUrl: string | null
  purchaseUrl: string | null
  submittedBy: string | null
  createdAt: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [books, setBooks] = useState<BookEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<BookEntry>>({})
  const [tab, setTab] = useState<"books" | "suggestions">("books")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const fetchBooks = useCallback(async (pw: string) => {
    setLoading(true)
    const res = await fetch("/api/books", {
      headers: { authorization: `Bearer ${pw}` },
    })
    if (res.ok) {
      setBooks(await res.json())
      setAuthed(true)
    }
    setLoading(false)
  }, [])

  const fetchSuggestions = useCallback(async (pw: string) => {
    const res = await fetch("/api/suggestions", {
      headers: { authorization: `Bearer ${pw}` },
    })
    if (res.ok) {
      setSuggestions(await res.json())
    }
  }, [])

  useEffect(() => {
    if (password) fetchBooks(password)
  }, [password, fetchBooks])

  useEffect(() => {
    if (password) fetchSuggestions(password)
  }, [password, fetchSuggestions])

  const saveBooks = async (updated: BookEntry[]) => {
    setMessage("")
    const res = await fetch("/api/books", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      setBooks(updated)
      setMessage("Saved ✓")
    } else {
      setMessage("Save failed")
    }
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    const updated = [...books]
    ;[updated[i - 1], updated[i]] = [updated[i], updated[i - 1]]
    saveBooks(updated)
  }

  const moveDown = (i: number) => {
    if (i === books.length - 1) return
    const updated = [...books]
    ;[updated[i], updated[i + 1]] = [updated[i + 1], updated[i]]
    saveBooks(updated)
  }

  const removeBook = (slug: string) => {
    if (!confirm(`Remove "${books.find((b) => b.slug === slug)?.title}"?`)) return
    saveBooks(books.filter((b) => b.slug !== slug))
  }

  const startEdit = (book: BookEntry) => {
    setEditingSlug(book.slug)
    setEditForm({ ...book })
  }

  const saveEdit = () => {
    if (!editingSlug) return
    const updated = books.map((b) => (b.slug === editingSlug ? { ...b, ...editForm } : b))
    saveBooks(updated)
    setEditingSlug(null)
    setEditForm({})
  }

  const addBook = () => {
    const slug = prompt("Enter a slug (e.g. 'my-new-book'):")
    if (!slug) return
    if (books.find((b) => b.slug === slug)) {
      alert("Slug already exists")
      return
    }
    const title = prompt("Title:") || slug
    const author = prompt("Author:") || "Unknown"
    const newBook: BookEntry = {
      slug,
      title,
      author,
      coverPlaceholder: title,
      whyNobledark: "",
      tags: [],
      year: new Date().getFullYear(),
      indie: true,
    }
    saveBooks([...books, newBook])
  }

  const handleSuggestionAction = async (id: number, action: "approve" | "reject") => {
    await fetch("/api/suggestions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ action, id }),
    })
    fetchSuggestions(password)
    fetchBooks(password)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-6">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-600"
            autoFocus
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
        <p className="text-stone-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <nav className="border-b border-stone-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg text-stone-200 hover:text-amber-400 transition-colors">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-stone-600">{books.length} books</span>
            <div className="flex gap-4">
              <button
                onClick={() => setTab("books")}
                className={`${tab === "books" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"} transition-colors`}
              >
                Books
              </button>
              <button
                onClick={() => { setTab("suggestions"); fetchSuggestions(password) }}
                className={`${tab === "suggestions" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"} transition-colors`}
              >
                Suggestions {suggestions.length > 0 && <span className="text-amber-600">({suggestions.length})</span>}
              </button>
            </div>
            <Link href="/books" className="text-stone-500 hover:text-stone-300 transition-colors">
              View Site →
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pt-8 pb-24">
        {tab === "books" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl">Manage Books</h1>
              <div className="flex items-center gap-3">
                {message && <span className="text-xs text-amber-500">{message}</span>}
                <button
                  onClick={addBook}
                  className="px-4 py-2 rounded bg-amber-700 hover:bg-amber-600 text-stone-100 text-sm transition-colors"
                >
                  + Add Book
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {books.map((book, i) => (
                <div key={book.slug} className="rounded-lg border border-stone-800 bg-stone-900/50 p-4 hover:border-stone-700 transition-colors">
                  {editingSlug === book.slug ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Title</label>
                          <input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Author</label>
                          <input value={editForm.author || ""} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Tags</label>
                        <input value={(editForm.tags || []).join(", ")} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Why Nobledark</label>
                        <textarea value={editForm.whyNobledark || ""} onChange={(e) => setEditForm({ ...editForm, whyNobledark: e.target.value })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1 h-20 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Cover URL</label>
                          <input value={editForm.coverUrl || ""} onChange={(e) => setEditForm({ ...editForm, coverUrl: e.target.value })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600">Purchase URL</label>
                          <input value={editForm.purchaseUrl || ""} onChange={(e) => setEditForm({ ...editForm, purchaseUrl: e.target.value })} className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-sm mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={saveEdit} className="px-4 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-stone-100 text-xs transition-colors">Save</button>
                        <button onClick={() => setEditingSlug(null)} className="px-4 py-1.5 rounded border border-stone-700 hover:border-stone-500 text-stone-400 text-xs transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveUp(i)} disabled={i === 0} className="text-stone-600 hover:text-stone-300 disabled:opacity-20 disabled:cursor-not-allowed">▲</button>
                        <button onClick={() => moveDown(i)} disabled={i === books.length - 1} className="text-stone-600 hover:text-stone-300 disabled:opacity-20 disabled:cursor-not-allowed">▼</button>
                      </div>
                      <div className="w-10 h-14 rounded bg-stone-800 overflow-hidden flex-shrink-0">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">✦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-medium truncate">{book.title}</p>
                        <p className="text-xs text-stone-500 truncate">{book.author}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {book.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-500">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(book)} className="px-3 py-1 rounded border border-stone-700 hover:border-stone-500 text-stone-400 text-xs transition-colors">Edit</button>
                        <button onClick={() => removeBook(book.slug)} className="px-3 py-1 rounded border border-red-900/50 hover:border-red-700 text-red-600 text-xs transition-colors">Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl">Suggestions ({suggestions.length})</h1>
            </div>
            {suggestions.length === 0 ? (
              <p className="text-stone-500 text-sm">No suggestions yet. Point readers to /suggest to collect them.</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="rounded-lg border border-stone-800 bg-stone-900/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-medium">{s.title}</p>
                        <p className="text-xs text-stone-500">{s.author}</p>
                        {s.whyNobledark && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">{s.whyNobledark}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {s.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-500">{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-2 text-[10px] text-stone-600">
                          {s.submittedBy && <span>By: {s.submittedBy}</span>}
                          <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleSuggestionAction(s.id, "approve")}
                          className="px-3 py-1 rounded bg-amber-700 hover:bg-amber-600 text-stone-100 text-xs transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSuggestionAction(s.id, "reject")}
                          className="px-3 py-1 rounded border border-red-900/50 hover:border-red-700 text-red-600 text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}