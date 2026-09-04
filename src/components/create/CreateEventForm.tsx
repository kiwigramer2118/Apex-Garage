"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { tracks, EVENT_CATEGORY_LABEL, CURRENT_USER_ID } from "@/lib/data";
import type { EventCategory, TrackEvent, TrackId } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { FormField, inputClass } from "./FormField";

const CATEGORIES = Object.keys(EVENT_CATEGORY_LABEL) as EventCategory[];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "event";
}

export function CreateEventForm({
  onBack,
  onPublished,
}: {
  onBack: () => void;
  onPublished: (href: string) => void;
}) {
  const addCreatedEvent = useAppStore((s) => s.addCreatedEvent);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("track-day");
  const [trackId, setTrackId] = useState<TrackId>(tracks[0].id);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("15:00");
  const [capacity, setCapacity] = useState(40);
  const [priceUsd, setPriceUsd] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = title.trim().length > 2 && date.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const track = tracks.find((t) => t.id === trackId)!;
    const id = `created-evt-${Date.now()}`;
    const event: TrackEvent = {
      id,
      title: title.trim(),
      category,
      trackId: track.id,
      date,
      startTime,
      endTime,
      lat: track.lat,
      lng: track.lng,
      description: description.trim() || "Sin descripción todavía.",
      hostId: CURRENT_USER_ID,
      capacity,
      attendeeIds: [CURRENT_USER_ID],
      priceUsd: priceUsd.trim() === "" ? null : Number(priceUsd),
      isLive: false,
      coverImage: `https://picsum.photos/seed/${slugify(title)}/1400/900`,
    };

    addCreatedEvent(event);
    onPublished(`/events/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-caption text-text-muted">
        <ChevronLeft size={15} /> Volver
      </button>
      <h1 className="font-display text-title text-text-primary">Nuevo evento</h1>

      <FormField label="Título">
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Buttonwillow Sunset Lapping"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Categoría">
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EVENT_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Pista">
          <select
            className={inputClass}
            value={trackId}
            onChange={(e) => setTrackId(e.target.value as TrackId)}
          >
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.shortName}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Fecha">
        <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Hora de inicio">
          <input
            className={inputClass}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormField>
        <FormField label="Hora de fin">
          <input className={inputClass} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Cupo">
          <input
            className={inputClass}
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Precio (USD, opcional)">
          <input
            className={inputClass}
            type="number"
            min={0}
            placeholder="Gratis"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Descripción">
        <textarea
          className={inputClass}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles del run group, tech inspection, punto de encuentro…"
        />
      </FormField>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 w-full rounded-button bg-accent py-3.5 text-body text-onaccent transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Publicar evento
      </button>
    </form>
  );
}
