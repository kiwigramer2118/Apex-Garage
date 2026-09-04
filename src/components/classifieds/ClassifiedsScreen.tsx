"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listings as mockListings, LISTING_CATEGORY_LABEL } from "@/lib/data";
import type { ListingCategory } from "@/types";
import { Chip } from "@/components/ui/Chip";
import { ListingCard } from "./ListingCard";
import { useAppStore } from "@/store/useAppStore";

const CATEGORIES = Object.keys(LISTING_CATEGORY_LABEL) as ListingCategory[];

export function ClassifiedsScreen() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [query, setQuery] = useState("");
  const createdListings = useAppStore((s) => s.createdListings);
  const listings = useMemo(() => [...createdListings, ...mockListings], [createdListings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesCategory = !category || l.category === category;
      const matchesQuery = query.trim() === "" || l.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query, listings]);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-10 pt-6">
      <h1 className="mb-4 font-display text-title text-text-primary">Clasificados</h1>

      <div className="mb-4 flex items-center gap-3 rounded-pill border border-border bg-surface-1 px-4 py-3">
        <Search size={17} className="text-text-muted" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar piezas, ruedas, suspensión…"
          className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-5">
        <Chip label="Todos" active={category === null} onClick={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={LISTING_CATEGORY_LABEL[c]}
            active={category === c}
            onClick={() => setCategory(c === category ? null : c)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-body text-text-muted">No hay publicaciones que coincidan.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
