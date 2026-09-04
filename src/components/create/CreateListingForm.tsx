"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  LISTING_CATEGORY_LABEL,
  LISTING_CONDITION_LABEL,
  CURRENT_USER_ID,
  getCarsByOwner,
  getCurrentUser,
} from "@/lib/data";
import type { Listing, ListingCategory, ListingCondition } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { FormField, inputClass } from "./FormField";

const CATEGORIES = Object.keys(LISTING_CATEGORY_LABEL) as ListingCategory[];
const CONDITIONS = Object.keys(LISTING_CONDITION_LABEL) as ListingCondition[];

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "listing"
  );
}

export function CreateListingForm({
  onBack,
  onPublished,
}: {
  onBack: () => void;
  onPublished: (href: string) => void;
}) {
  const addCreatedListing = useAppStore((s) => s.addCreatedListing);
  const myCars = getCarsByOwner(CURRENT_USER_ID);
  const currentUser = getCurrentUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ListingCategory>("wheels");
  const [condition, setCondition] = useState<ListingCondition>("used");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [fitment, setFitment] = useState("");
  const [description, setDescription] = useState("");
  const [carId, setCarId] = useState<string>(myCars[0]?.id ?? "");

  const canSubmit = title.trim().length > 2 && price.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const id = `created-lst-${Date.now()}`;
    const listing: Listing = {
      id,
      title: title.trim(),
      category,
      condition,
      priceUsd: Number(price),
      negotiable,
      location: currentUser.location,
      description: description.trim() || "Sin descripción todavía.",
      images: [
        `https://picsum.photos/seed/${slugify(title)}-1/1200/900`,
        `https://picsum.photos/seed/${slugify(title)}-2/1200/900`,
      ],
      sellerId: CURRENT_USER_ID,
      fitment: fitment.trim() || "Consultar con el vendedor",
      postedAt: new Date().toISOString().slice(0, 10),
      carId: carId || null,
    };

    addCreatedListing(listing);
    onPublished(`/classifieds/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-caption text-text-muted">
        <ChevronLeft size={15} /> Volver
      </button>
      <h1 className="font-display text-title text-text-primary">Nuevo clasificado</h1>

      <FormField label="Título">
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Volk TE37 17x9 — Set de 4"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Categoría">
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {LISTING_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Condición">
          <select
            className={inputClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value as ListingCondition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {LISTING_CONDITION_LABEL[c]}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Precio (USD)">
          <input
            className={inputClass}
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="450"
            required
          />
        </FormField>
        <label className="flex items-end gap-2 pb-2.5">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={(e) => setNegotiable(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <span className="text-body text-text-secondary">Negociable</span>
        </label>
      </div>

      <FormField label="Fitment">
        <input
          className={inputClass}
          value={fitment}
          onChange={(e) => setFitment(e.target.value)}
          placeholder="Ej. 5x114.3, BMW E46"
        />
      </FormField>

      {myCars.length > 0 && (
        <FormField label="Vincular a uno de tus autos (opcional)">
          <select className={inputClass} value={carId} onChange={(e) => setCarId(e.target.value)}>
            <option value="">Ninguno</option>
            {myCars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.year} {c.make} {c.model}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField label="Descripción">
        <textarea
          className={inputClass}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Estado, tiempo de uso, razón de venta…"
        />
      </FormField>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 w-full rounded-button bg-accent py-3.5 text-body text-onaccent transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Publicar clasificado
      </button>
    </form>
  );
}
