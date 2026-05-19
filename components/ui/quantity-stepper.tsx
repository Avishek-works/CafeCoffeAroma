interface QuantityStepperProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function QuantityStepper({ quantity, onDecrease, onIncrease }: QuantityStepperProps) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={onIncrease}
        className="btn-gold inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-full px-4 text-sm font-semibold"
      >
        Add
      </button>
    );
  }

  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-[var(--accent-gold)]/30 bg-[var(--bg-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <button
        type="button"
        onClick={onDecrease}
        className="h-full min-w-10 px-3 text-base font-bold text-[var(--accent-gold)] transition-colors duration-180 ease-out hover:bg-[var(--accent-gold-soft)] active:scale-[0.96]"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        key={quantity}
        className="fade-in-up min-w-[1.75rem] text-center text-sm font-semibold text-[var(--text-primary)] tabular-nums"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="h-full min-w-10 px-3 text-base font-bold text-[var(--accent-gold)] transition-colors duration-180 ease-out hover:bg-[var(--accent-gold-soft)] active:scale-[0.96]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
