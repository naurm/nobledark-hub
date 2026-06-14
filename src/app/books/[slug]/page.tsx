import { notFound } from "next/navigation"
import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"
import { getBookBySlug } from "@/lib/books"

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Nav */}
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

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Cover */}
          <div className="aspect-[2/3] bg-stone-800/50 rounded-lg flex items-center justify-center overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center px-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 text-lg">✦</span>
                </div>
                <p className="text-sm text-stone-500 font-serif">{book.coverPlaceholder}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            {book.series && (
              <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
                {book.series} {book.seriesOrder ? `· Book ${book.seriesOrder}` : ""}
              </p>
            )}

            <h1 className="font-serif text-3xl text-stone-100">{book.title}</h1>

            <p className="text-stone-400">
              by{" "}
              {book.authorUrl ? (
                <a href={book.authorUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-2">
                  {book.author}
                </a>
              ) : (
                <span>{book.author}</span>
              )}
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-stone-500">
              <span>{book.year}</span>
              {book.indie && (
                <span className="px-2 py-0.5 rounded bg-amber-900/30 text-amber-600">Indie</span>
              )}
            </div>

            <div className="pt-4 border-t border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-wider text-amber-600 mb-2">Why It&apos;s Nobledark</h2>
              <p className="text-stone-300 leading-relaxed">{book.whyNobledark}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {book.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="px-3 py-1 text-xs rounded-full bg-stone-800 text-stone-400 hover:bg-amber-900/40 hover:text-amber-400 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {book.purchaseUrl && (
              <a
                href={book.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-stone-100 rounded-lg text-sm font-medium transition-colors"
              >
                Find the Book
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}