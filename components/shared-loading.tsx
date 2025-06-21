import { Skeleton } from '@/components/ui/skeleton'; 

export function SharedLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}