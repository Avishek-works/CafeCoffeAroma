import Link from "next/link";
import { normalizeTable } from "@/lib/data";

export default async function TablePage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = await params;
  const normalizedTable = normalizeTable(tableId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-6">
      <section className="card-surface fade-in-up rounded-[2rem] p-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-gold)]/90">Cafe Coffee Aroma</p>
        </div>
        <h1 className="mt-4 text-4xl font-bold text-[var(--text-primary)] tracking-tight">Table {normalizedTable}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Browse the menu, add your favourites, and place your order directly from your phone.
        </p>
        <div className="mt-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <p className="text-sm text-[var(--text-tertiary)]">Scan the menu, add your picks, and order in minutes.</p>
        </div>
        <Link
          href={`/order/table/${normalizedTable}/menu`}
          className="btn-gold mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-4 text-sm font-bold tracking-wide"
        >
          Start Ordering →
        </Link>
      </section>
    </main>
  );
}
