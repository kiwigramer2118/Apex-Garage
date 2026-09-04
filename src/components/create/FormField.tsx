export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption text-text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-button border border-border bg-surface-1 px-3.5 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none";
