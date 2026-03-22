import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-16 sm:px-6">
      <Skeleton className="h-9 max-w-xs rounded-md" />
      <Skeleton className="h-4 max-w-2xl rounded-md" />
      <div className="mt-12 space-y-8">
        <Skeleton className="h-8 max-w-sm rounded-md" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
