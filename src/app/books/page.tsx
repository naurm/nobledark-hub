import Link from "next/link"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { getBooks, getAllTags } from "@/lib/books"
import BookCard from "@/components/ui/BookCard"

export const metadata: Metadata = {
  title: "Directory — Nobledark Hub",
  description: "Browse the curated directory of nobledark fantasy books — epic, political, grim, hopeful, and everything in between.",
  openGraph: {
    title: "Directory — Nobledark Hub",
    description: "Browse the curated directory of nobledark fantasy books.",
    url: `${SITE_URL}/books`,
  },
}

export default async function BooksPage() {
  const [books, tags] = await Promise.all([getBooks(), getAllTags()])

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Nav */}
      <nav className="border-b border-stone-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg text-stone-200 hover:text-amber-400 transition-colors">
            {SITE_NAME}
          </Link>
          <div className="flex gap-6 text-sm text-stone-500">
            <Link href="/books" className="text-amber-500 font-medium">Directory</Link>
            <Link href="/about" className="hover:text-stone-300 transition-colors">About</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <h1 className="font-serif text-3xl text-stone-100 mb-2">Directory</h1>
        <p className="text-stone-500 mb-8">A curated list of nobledark fantasy — built by readers, for readers.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/books"
            className="px-3 py-1.5 text-xs rounded-full bg-stone-800 text-stone-300 hover:bg-amber-900/40 hover:text-amber-400 transition-colors"
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="px-3 py-1.5 text-xs rounded-full bg-stone-800 text-stone-500 hover:bg-amber-900/40 hover:text-amber-400 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}