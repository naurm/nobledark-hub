import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, author, whyNobledark, tags, coverUrl, purchaseUrl, submittedBy } = body

    if (!title || !author) {
      return NextResponse.json({ error: "Title and author are required" }, { status: 400 })
    }

    const suggestion = {
      title: title.trim(),
      author: author.trim(),
      whyNobledark: (whyNobledark || "").trim(),
      tags: tags ? tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean) : [],
      coverUrl: (coverUrl || "").trim() || null,
      purchaseUrl: (purchaseUrl || "").trim() || null,
      submittedBy: (submittedBy || "").trim() || null,
      createdAt: new Date().toISOString(),
    }

    await query(
      `INSERT INTO suggestions (data) VALUES ($1)`,
      [JSON.stringify(suggestion)]
    )

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Suggest error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}