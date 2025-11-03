import { Skeleton } from '@/components/ui/skeleton';
import loadingIcon from '@/assets/images/icon-loading.svg';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4" role="status" aria-live="polite">
      <img src={loadingIcon} alt="Loading" className="w-16 h-16 animate-spin" />
      <p className="text-neutral-600 text-lg">Loading weather data...</p>
    </div>
  );
}

export function WeatherCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
