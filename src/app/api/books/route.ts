import { NextRequest, NextResponse } from "next/server"
import { getBooks, saveBooks, BookEntry } from "@/lib/books"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nobledark2024"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) return unauthorized()

  const books = await getBooks()
  return NextResponse.json(books)
}

export async function PUT(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) return unauthorized()

  try {
    const books: BookEntry[] = await request.json()
    await saveBooks(books)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}