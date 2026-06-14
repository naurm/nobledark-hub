import Link from "next/link"
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL, KO_FI_URL, GENRE_DEFINITION } from "@/lib/constants"
import { getBooks, getAllTags } from "@/lib/books"
import BookCard from "@/components/ui/BookCard"

export default async function HomePage() {
  const [books, tags] = await Promise.all([getBooks(), getAllTags()])
  const featured = books.slice(0, 8)

  return (
    <>
      {/* Hero — banner background */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Banner image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60" />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/50 border border-amber-700/60 text-amber-400 text-xs font-mono uppercase tracking-wider mb-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ember-glow" />
            A reader&apos;s guide to the genre
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-stone-100 leading-tight">
            {SITE_NAME}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-stone-300 max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {SITE_TAGLINE}
          </p>
          <p className="mt-4 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {GENRE_DEFINITION}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link
              href="/books"
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-stone-100 rounded-lg text-sm font-medium transition-colors"
            >
              Browse the Directory
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-stone-700 hover:border-stone-500 rounded-lg text-sm font-medium text-stone-300 transition-colors"
            >
              What Is Nobledark?
            </Link>
          </div>
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="mx-auto max-w-4xl px-6 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="px-3 py-1 text-xs rounded-full bg-stone-800 text-stone-400 hover:bg-amber-900/40 hover:text-amber-400 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-stone-800" />
          <span className="text-xs font-mono uppercase tracking-widest text-stone-600">
            Featured
          </span>
          <div className="h-px flex-1 bg-stone-800" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((book) => (
            <BookCard key={book.slug} book={book} compact />
          ))}
        </div>

        {books.length > 8 && (
          <div className="text-center mt-8">
            <Link
              href="/books"
              className="text-sm text-amber-600 hover:text-amber-500 transition-colors font-mono uppercase tracking-wider"
            >
              View all {books.length} books →
            </Link>
          </div>
        )}
      </section>

      {/* Community callout */}
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <div className="p-8 rounded-lg border border-stone-800 bg-stone-900/40">
          <h2 className="font-serif text-xl text-stone-200 mb-3">Know a book that belongs here?</h2>
          <p className="text-stone-500 text-sm mb-6 max-w-lg mx-auto">
            This directory is community-built. If there&apos;s a nobledark fantasy we&apos;ve missed,
            send it in. Every suggestion gets reviewed.
          </p>
          <Link
            href="/suggest"
            className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-600 text-stone-100 rounded-lg text-sm font-medium transition-colors"
          >
            Suggest a Book
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800">
        <div className="mx-auto max-w-4xl px-6 py-8 text-center text-xs text-stone-600">
          <p>{SITE_NAME} — {SITE_TAGLINE}</p>
          <p className="mt-1">A curated directory. Not affiliated with any publisher or author.</p>
          <p className="mt-2">
            <Link href="/suggest" className="text-amber-700 hover:text-amber-600 transition-colors">
              Suggest a book
            </Link>
            {" · "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-700 hover:text-amber-600 transition-colors">
              Contact
            </a>
            {" · "}
            <a href={KO_FI_URL} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-600 transition-colors">
              Support on Ko‑fi
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}