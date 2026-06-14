import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { getAllTags, getBooksByTag } from "@/lib/books"
import BookCard from "@/components/ui/BookCard"

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params
  const title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} Nobledark Books — ${SITE_NAME}`
  const description = `Browse nobledark fantasy books tagged with "${tag}" — a curated directory.`
  return {
    title,
    description,
    openGraph: { title, description, url: `${SITE_URL}/tag/${tag}` },
  }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const [validTags, tagged] = await Promise.all([getAllTags(), getBooksByTag(tag)])
  if (!validTags.includes(tag)) notFound()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <nav className="border-b border-stone-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg text-stone-200 hover:text-amber-400 transition-colors">
            {SITE_NAME}
          </Link>
          <Link href="/books" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
            ← Directory
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <h1 className="font-serif text-2xl text-stone-100 mb-2 capitalize">{tag}</h1>
        <p className="text-stone-500 mb-10">{tagged.length} {tagged.length === 1 ? "book" : "books"} tagged with {tag}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tagged.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}