#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Pool } from "pg";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("DATABASE_URL not set — skipping seed");
    return;
  }

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    const raw = readFileSync(new URL("../data/books.json", import.meta.url), "utf-8");
    const books = JSON.parse(raw);

    await pool.query("DELETE FROM books");
    for (let i = 0; i < books.length; i++) {
      await pool.query("INSERT INTO books (sort_order, data) VALUES ($1, $2)", [
        i,
        JSON.stringify(books[i]),
      ]);
    }

    console.log(`Seeded ${books.length} books successfully`);
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});