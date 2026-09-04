import { Skeleton } from "@/components/ui/Skeleton";

export default function MainLoading() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-6">
      <Skeleton className="mb-4 h-8 w-40" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </div>
  );
}
