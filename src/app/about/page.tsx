import Link from "next/link"
import type { Metadata } from "next"
import { SITE_NAME, SITE_TAGLINE, SITE_URL, GENRE_DEFINITION } from "@/lib/constants"

export const metadata: Metadata = {
  title: "What Is Nobledark? — Nobledark Hub",
  description: "Nobledark fantasy explained: the space between grimdark and noblebright, where hope is scarce but earned.",
  openGraph: {
    title: "What Is Nobledark? — Nobledark Hub",
    description: "Nobledark fantasy explained: the space between grimdark and noblebright.",
    url: `${SITE_URL}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <nav className="border-b border-stone-800">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg text-stone-200 hover:text-amber-400 transition-colors">
            {SITE_NAME}
          </Link>
          <div className="flex gap-6 text-sm text-stone-500">
            <Link href="/books" className="hover:text-stone-300 transition-colors">Directory</Link>
            <Link href="/about" className="text-amber-500 font-medium">About</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-24 space-y-8">
        <h1 className="font-serif text-3xl text-stone-100">What Is Nobledark?</h1>

        <div className="space-y-4 text-stone-300 leading-relaxed">
          <p>{GENRE_DEFINITION}</p>

          <p>
            If grimdark asks whether decency was ever real, nobledark asks whether decency can survive contact with power.
            The world stays cruel. Systems stay broken. But the refusal to become worse still matters.
          </p>

          <p>
            A nobledark protagonist understands the cost of action — and the cost of inaction. They act anyway.
            Not because victory is guaranteed. Because not trying would cost them who they are.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-stone-800 bg-stone-900/50">
          <h2 className="font-serif text-xl text-stone-100 mb-4">Nobledark vs. Grimdark vs. Noblebright</h2>
          <div className="space-y-4 text-sm text-stone-400">
            <div>
              <span className="text-amber-600 font-medium">Grimdark:</span> Morally exhausted worlds where kindness is punished and survival replaces ethics. Characters are often amoral. Hope is a lie.
            </div>
            <div>
              <span className="text-amber-600 font-medium">Nobledark:</span> Harsh worlds where characters still carry moral weight. Hope is scarce but real — earned through sacrifice. No clean victories, but refusal to surrender still matters.
            </div>
            <div>
              <span className="text-amber-600 font-medium">Noblebright:</span> Worlds where goodness is rewarded, institutions function, and evil is external. Sacrifice leads to renewal. Heroes win because they deserve to.
            </div>
          </div>
        </div>

        <div className="space-y-4 text-stone-300 leading-relaxed">
          <h2 className="font-serif text-xl text-stone-100 pt-4">About This Site</h2>
          <p>
            {SITE_NAME} is a reader-built directory of nobledark fantasy books and series.
            There&apos;s no algorithm, no paid placement — just a growing list of stories where the darkness is real but hope has weight.
          </p>
          <p>
            Know a book that belongs here? This site is open source and community-driven.
            Suggestions are welcome.
          </p>
        </div>
      </section>
    </div>
  )
}