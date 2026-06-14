import Link from "next/link"
import { BookEntry } from "@/lib/books"

export default function BookCard({ book, compact = false }: { book: BookEntry; compact?: boolean }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group block rounded-lg border border-stone-800 bg-stone-900/50 overflow-hidden hover:border-amber-800/60 hover:bg-stone-900 transition-all"
    >
      {/* Cover — real image or placeholder */}
      <div className="bg-stone-800/50 overflow-hidden">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`aspect-[2/3] flex items-center justify-center px-4`}>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-amber-900/40 flex items-center justify-center">
                <span className="text-amber-600/80 text-xs">✦</span>
              </div>
              <p className="text-xs text-stone-500 font-serif line-clamp-1">{book.coverPlaceholder}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-stone-500">{book.author}</p>
        <h3 className="text-sm text-stone-200 font-medium group-hover:text-amber-400 transition-colors line-clamp-1">
          {book.title}
        </h3>
        {!compact && book.whyNobledark && (
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {book.whyNobledark}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {book.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}