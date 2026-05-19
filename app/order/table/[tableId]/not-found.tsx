import Link from "next/link";

export default function TableNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-4">
      <section className="card-surface fade-in-up rounded-3xl p-6 text-center">
        <p className="text-3xl">🔍</p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)] tracking-tight">Table not found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Please scan a valid Cafe Coffee Aroma QR code.</p>
        <Link
          href="/"
          className="btn-gold mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-bold tracking-wide"
        >
          Back Home
        </Link>
      </section>
    </main>
  );
}
