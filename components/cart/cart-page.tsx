"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatCurrency } from "@/lib/format";

export function CartPageView({ tableId }: { tableId: string }) {
  const { items, subtotal, notes, setNotes, setQty } = useCart();

  return (
    <section>
      {/* Header */}
      <div className="card-surface fade-in-up rounded-[1.5rem] p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-gold)]/85">Table {tableId}</p>
        <h1 className="mt-1.5 text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Your cart</h1>
      </div>

      <Link
        href={`/order/table/${tableId}/menu`}
        className="btn-ghost mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-3.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        ← Add More Items
      </Link>

      {items.length === 0 ? (
        <div className="card-surface mt-4 rounded-2xl p-8 text-center">
          <p className="text-2xl">☕</p>
          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">Your cart is empty</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Browse the menu and add your favourites.</p>
          <Link
            href={`/order/table/${tableId}/menu`}
            className="btn-gold mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-bold"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="card-surface mt-4 overflow-hidden rounded-2xl">
            <div className="divide-y divide-[var(--border-warm)]">
              {items.map((item) => (
                <article key={item.menuItemId} className="card-hover flex items-center gap-3 p-3.5">
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{item.itemName}</h2>
                    <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{formatCurrency(item.unitPrice)} each</p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--accent-gold)]">{formatCurrency(item.qty * item.unitPrice)}</p>
                  </div>
                  <div className="shrink-0">
                    <QuantityStepper
                      quantity={item.qty}
                      onDecrease={() => setQty(item.menuItemId, item.qty - 1)}
                      onIncrease={() => setQty(item.menuItemId, item.qty + 1)}
                    />
                  </div>
                </article>
              ))}
            </div>

            <label className="block border-t border-[var(--border-warm)] p-3.5 text-xs font-medium text-[var(--text-secondary)]">
              Order notes (optional)
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Less sugar, extra hot, no onion…"
                className="input-surface mt-2 w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </label>
          </div>

          {/* Sticky checkout */}
          <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+0.65rem)] z-20 mt-4 overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-elevated)] shadow-[0_24px_34px_-24px_var(--shadow-warm),inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-base font-bold text-[var(--text-primary)]">Total</span>
                <span className="text-xl font-bold text-[var(--accent-gold)] tracking-tight">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <div className="p-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
              <Link
                href={`/order/table/${tableId}/details`}
                className="btn-gold inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-bold tracking-wide"
              >
                Continue to checkout →
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
