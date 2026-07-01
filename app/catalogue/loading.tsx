import { ProductGridSkeleton, Skeleton } from '@/components/site/Loader';

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-4 h-10 w-full max-w-md" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
