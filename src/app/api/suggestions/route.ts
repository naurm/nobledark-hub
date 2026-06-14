import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { saveBooks, getBooks, type BookEntry } from "@/lib/books"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nobledark2024"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) return unauthorized()

  const result = await query("SELECT id, data, created_at FROM suggestions ORDER BY created_at DESC")
  return NextResponse.json(result.rows.map((r: any) => ({ id: r.id, ...r.data, createdAt: r.created_at })))
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) return unauthorized()

  const { action, id } = await request.json()

  if (action === "approve") {
    const result = await query("SELECT data FROM suggestions WHERE id = $1", [id])
    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const suggestion = result.rows[0].data as BookEntry
    const books = await getBooks()

    // Generate a slug from the title
    const slug = suggestion.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Check for duplicate slug
    let finalSlug = slug
    let counter = 1
    while (books.find((b) => b.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`
      counter++
    }

    const newBook: BookEntry = {
      slug: finalSlug,
      title: suggestion.title,
      author: suggestion.author,
      whyNobledark: suggestion.whyNobledark,
      tags: suggestion.tags || [],
      coverUrl: suggestion.coverUrl || undefined,
      purchaseUrl: suggestion.purchaseUrl || undefined,
      coverPlaceholder: suggestion.title,
      year: new Date().getFullYear(),
      indie: false,
    }

    await saveBooks([...books, newBook])
    await query("DELETE FROM suggestions WHERE id = $1", [id])

    return NextResponse.json({ success: true, slug: finalSlug })
  }

  if (action === "reject") {
    await query("DELETE FROM suggestions WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}