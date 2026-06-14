import { query } from "./db"

export type BookEntry = {
  slug: string
  title: string
  author: string
  authorUrl?: string
  series?: string
  seriesOrder?: number
  coverPlaceholder: string
  coverUrl?: string
  whyNobledark: string
  tags: string[]
  purchaseUrl?: string
  year: number
  indie: boolean
}

export async function getBooks(): Promise<BookEntry[]> {
  const result = await query("SELECT data FROM books ORDER BY sort_order ASC")
  return result.rows.map((r: any) => r.data as BookEntry)
}

export async function getBookBySlug(slug: string): Promise<BookEntry | undefined> {
  const books = await getBooks()
  return books.find((b) => b.slug === slug)
}

export async function getAllTags(): Promise<string[]> {
  const books = await getBooks()
  const set = new Set<string>()
  books.forEach((b) => b.tags.forEach((t) => set.add(t)))
  return [...set].sort()
}

export async function getBooksByTag(tag: string): Promise<BookEntry[]> {
  const books = await getBooks()
  return books.filter((b) => b.tags.includes(tag))
}

export async function saveBooks(books: BookEntry[]): Promise<void> {
  // Delete all then reinsert in order
  await query("DELETE FROM books")
  for (let i = 0; i < books.length; i++) {
    await query(
      "INSERT INTO books (sort_order, data) VALUES ($1, $2)",
      [i, JSON.stringify(books[i])]
    )
  }
}