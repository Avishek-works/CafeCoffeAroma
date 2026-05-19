"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export function StickyCartBar({ tableId }: { tableId: string }) {
  const pathname = usePathname();
  const { itemCount, subtotal } = useCart();
  const [pulseCount, setPulseCount] = useState(false);

  useEffect(() => {
    if (itemCount === 0) return;
    setPulseCount(true);
    const timer = window.setTimeout(() => setPulseCount(false), 180);
    return () => window.clearTimeout(timer);
  }, [itemCount]);

  if (itemCount === 0) return null;
  if (pathname.endsWith("/cart") || pathname.endsWith("/details") || pathname.endsWith("/success")) return null;

  return (
    <div className="fade-in-up fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2.5">
      <Link
        href={`/order/table/${tableId}/cart`}
        className="card-hover flex h-14 items-center justify-between rounded-[1.35rem] border border-[var(--border-warm)] bg-[var(--bg-elevated)] px-4 text-[var(--text-primary)] shadow-[0_20px_30px_-24px_var(--shadow-warm),inset_0_1px_0_rgba(255,255,255,0.02)] transition-transform duration-180 ease-out active:scale-[0.98]"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent-gold)]/35 bg-[var(--accent-gold-soft)] text-xs font-bold text-[var(--accent-gold)] transition-transform duration-180 ease-out ${
              pulseCount ? "scale-105" : "scale-100"
            }`}
          >
            {itemCount}
          </span>
          {itemCount === 1 ? "1 item" : `${itemCount} items`}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent-gold)]">
          View Cart · {formatCurrency(subtotal)}
          <span className="text-base">→</span>
        </span>
      </Link>
    </div>
  );
}
