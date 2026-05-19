"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrderAction } from "@/app/order/actions";
import { useCart } from "@/components/cart/cart-provider";

export function CustomerDetailsForm({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { items, notes, customer, setCustomer, subtotal, clearCart } = useCart();

  const placeOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const inFlightToken = sessionStorage.getItem("cca-order-token") || crypto.randomUUID();
    sessionStorage.setItem("cca-order-token", inFlightToken);

    startTransition(async () => {
      const result = await placeOrderAction({
        tableNumber: tableId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerDob: customer.dob,
        notes,
        clientToken: inFlightToken,
        items,
      });

      if (!result.ok || !result.orderId) {
        const message =
          result.error === "Table is invalid or inactive."
            ? "The table number is invalid or inactive. Please return home and enter a valid table number."
            : result.error || "Unable to place order.";
        setError(message);
        return;
      }

      sessionStorage.removeItem("cca-order-token");
      clearCart();
      router.push(`/order/table/${tableId}/success?orderId=${result.orderId}`);
    });
  };

  return (
    <section>
      {/* Header */}
      <div className="card-surface fade-in-up rounded-[1.5rem] p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-gold)]/85">Checkout</p>
        <h1 className="mt-1.5 text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Your details</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">A few details to complete your order.</p>
      </div>

      <form onSubmit={placeOrder} className="mt-5 space-y-4">
        <Field
          label="Name *"
          value={customer.name}
          onChange={(value) => setCustomer({ name: value })}
          placeholder="Enter your name"
        />
        <Field
          label="Phone *"
          value={customer.phone}
          onChange={(value) => setCustomer({ phone: value })}
          placeholder="Enter your phone"
          inputMode="tel"
        />
        <Field
          label="Email (optional)"
          value={customer.email}
          onChange={(value) => setCustomer({ email: value })}
          placeholder="Enter your email"
          inputMode="email"
        />
        <Field
          label="Date of Birth (optional)"
          value={customer.dob}
          onChange={(value) => setCustomer({ dob: value })}
          placeholder="YYYY-MM-DD"
        />

        <p className="text-xs text-[var(--text-secondary)]">Share your birthday for special treats and offers.</p>

        {/* Order total */}
        <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-elevated)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Order total</span>
            <span className="text-xl font-bold text-[var(--accent-gold)] tracking-tight">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {error ? (
          <p className="fade-in-up rounded-xl border border-red-800/40 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-300">{error}</p>
        ) : null}

        <button
          disabled={isPending}
          className="btn-gold inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-4 text-sm font-bold tracking-wide"
          type="submit"
        >
          {isPending ? "Placing order…" : "Place order →"}
        </button>

        <Link
          href={`/order/table/${tableId}/cart`}
          className="btn-ghost inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Back to cart
        </Link>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="input-surface mt-2 w-full rounded-2xl px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}
