import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
      <p className="font-display text-display text-text-primary">404</p>
      <p className="text-body text-text-secondary">We couldn't find this page.</p>
      <Link href="/" className="mt-2 text-caption text-accent-ink underline underline-offset-2">
        Back to the map
      </Link>
    </div>
  );
}
