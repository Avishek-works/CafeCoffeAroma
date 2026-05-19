import Link from "next/link";
import { MenuView } from "@/components/menu/menu-view";
import { getMenuData, normalizeTable } from "@/lib/data";

export default async function MenuPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = await params;
  const normalizedTable = normalizeTable(tableId);

  try {
    const menu = await getMenuData();

    return (
      <main className="mx-auto w-full max-w-md px-4 pt-4">
        <MenuView tableNumber={normalizedTable} categories={menu.categories} items={menu.items} />
      </main>
    );
  } catch {
    return (
      <main className="mx-auto w-full max-w-md px-4 pt-4">
        <section className="card-surface fade-in-up rounded-[1.75rem] p-6 text-center">
          <p className="text-3xl">⚠️</p>
          <p className="mt-4 text-sm font-bold text-[var(--text-primary)]">Unable to load menu</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">There was a problem fetching the menu. Please check your connection and refresh.</p>
          <Link href="/" className="btn-gold mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl text-sm font-bold tracking-wide">Go Home</Link>
        </section>
      </main>
    );
  }
}
