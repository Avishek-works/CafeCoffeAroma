"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatCurrency } from "@/lib/format";
import { ALL_CATEGORY, MENU_DEFAULT_IMAGE, enrichMenuItems, resolveMenuImage } from "@/lib/menu-ui";
import type { CategoryFilter, MenuCategory, MenuPresentationItem, RawMenuItem } from "@/lib/types";

interface MenuViewProps {
  tableNumber: string;
  categories: MenuCategory[];
  items: RawMenuItem[];
}

export function MenuView({ tableNumber, categories, items }: MenuViewProps) {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sort_order - b.sort_order),
    [categories],
  );
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(ALL_CATEGORY);
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [bestOnly, setBestOnly] = useState(false);
  const { items: cartItems, addItem, setQty } = useCart();

  const qtyById = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((item) => map.set(item.menuItemId, item.qty));
    return map;
  }, [cartItems]);

  const enrichedItems = useMemo(() => enrichMenuItems(items), [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return enrichedItems.filter((item) => {
      if (activeCategory !== ALL_CATEGORY && item.category_id !== activeCategory) return false;
      if (vegOnly && !item.uiIsVeg) return false;
      if (nonVegOnly && !item.uiIsNonVeg) return false;
      if (bestOnly && !item.uiIsBestseller) return false;

      if (!normalizedQuery) return true;
      return item.name.toLowerCase().includes(normalizedQuery) || (item.description ?? "").toLowerCase().includes(normalizedQuery);
    });
  }, [activeCategory, bestOnly, enrichedItems, nonVegOnly, query, vegOnly]);

  return (
    <section>
      {/* Header */}
      <div className="card-surface fade-in-up rounded-[1.5rem] p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-gold)]/85">Table {tableNumber}</p>
        <h1 className="mt-1.5 text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Order Menu</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">Select your picks from the table.</p>
      </div>

      {/* Search + Filters */}
      <div className="card-surface mt-3 rounded-2xl p-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm select-none">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu…"
            className="input-surface w-full rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none"
          />
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <CategoryChip
            active={activeCategory === ALL_CATEGORY}
            label="All"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
          />
          {sortedCategories.map((category) => (
            <CategoryChip
              key={category.id}
              active={activeCategory === category.id}
              label={category.name}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>

        {/* Filter pills */}
        <div className="mt-2 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <FilterButton
            label="🌿 Veg"
            active={vegOnly}
            onClick={() => {
              const next = !vegOnly;
              setVegOnly(next);
              if (next) setNonVegOnly(false);
            }}
          />
          <FilterButton
            label="🍗 Non-Veg"
            active={nonVegOnly}
            onClick={() => {
              const next = !nonVegOnly;
              setNonVegOnly(next);
              if (next) setVegOnly(false);
            }}
          />
          <FilterButton label="⭐ Bestseller" active={bestOnly} onClick={() => setBestOnly((prev) => !prev)} />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="card-surface mt-4 rounded-2xl p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">No items match your filters.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5 pb-4">
          {filteredItems.map((item) => {
            const qty = qtyById.get(item.id) ?? 0;
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                qty={qty}
                onAdd={() =>
                  addItem({
                    menuItemId: item.id,
                    itemName: item.name,
                    unitPrice: item.price,
                    imageUrl: item.uiImage,
                  })
                }
                onDecrease={() => setQty(item.id, qty - 1)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ─── Menu Item Card ─────────────────────────────────────────────────── */

function MenuItemCard({
  item,
  qty,
  onAdd,
  onDecrease,
}: {
  item: MenuPresentationItem;
  qty: number;
  onAdd: () => void;
  onDecrease: () => void;
}) {
  return (
    <article className="card-surface card-hover group flex items-center gap-3.5 rounded-2xl p-3.5">
      {/* Image */}
      <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02),inset_0_-8px_20px_-14px_rgba(0,0,0,0.65)]">
        <MenuItemImage src={item.uiImage} alt={item.name} categoryId={item.category_id} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)] leading-snug">{item.name}</h3>
        {item.description ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--text-tertiary)] leading-relaxed">{item.description}</p>
        ) : null}
        <p className="mt-1 text-[15px] font-bold text-[var(--accent-gold)] tracking-tight">{formatCurrency(item.price)}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {item.uiIsVeg ? <Badge label="Veg" color="green" /> : null}
          {item.uiIsNonVeg ? <Badge label="Non-Veg" color="red" /> : null}
          {item.uiIsBestseller ? <Badge label="★ Top Pick" color="gold" /> : null}
        </div>
      </div>

      {/* Qty stepper */}
      <div className="shrink-0">
        <QuantityStepper
          quantity={qty}
          onIncrease={onAdd}
          onDecrease={onDecrease}
        />
      </div>
    </article>
  );
}

/* ─── Menu Item Image with fallback ────────────────────────────────────── */

function MenuItemImage({ src, alt, categoryId }: { src: string; alt: string; categoryId: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    if (imgSrc !== MENU_DEFAULT_IMAGE) {
      // Try to fall back to category image, then default
      const fallback = resolveMenuImage({ id: "", name: "", category_id: categoryId, description: null, image_url: null, price: 0, is_veg: false, is_non_veg: false, is_bestseller: false, active: true });
      setImgSrc(fallback !== src ? fallback : MENU_DEFAULT_IMAGE);
    }
  };

  return (
    <>
      <div className={`absolute inset-0 bg-[var(--bg-surface)] transition-opacity duration-200 ease-out ${loaded ? "opacity-0" : "opacity-100"}`} />
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="80px"
        loading="lazy"
        className={`object-cover transition-[transform,opacity] duration-200 ease-out group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        unoptimized={imgSrc.startsWith("http")}
      />
    </>
  );
}

/* ─── Category Chip ──────────────────────────────────────────────────── */

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-[transform,color,background-color,border-color] duration-180 ease-out active:scale-[0.98] ${
        active
          ? "border-[var(--accent-gold)]/35 bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--accent-gold)] transition-[transform,opacity] duration-180 ease-out ${
          active ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </button>
  );
}

/* ─── Filter Button ──────────────────────────────────────────────────── */

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-[transform,color,background-color,border-color] duration-180 ease-out active:scale-[0.98] ${
        active
          ? "border-[var(--accent-gold)]/35 bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────── */

function Badge({ label, color }: { label: string; color: "green" | "red" | "gold" }) {
  const styles = {
    green: "border border-emerald-700/35 bg-emerald-950/45 text-emerald-300",
    red: "border border-red-700/35 bg-red-950/45 text-red-300",
    gold: "border border-[var(--accent-gold)]/30 bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[color]}`}>{label}</span>
  );
}
