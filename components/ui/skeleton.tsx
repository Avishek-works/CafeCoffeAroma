export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton-shimmer rounded-xl border border-[var(--border-warm)]/60 bg-[var(--bg-surface)] ${className}`}
      aria-hidden="true"
    />
  );
}
