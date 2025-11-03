import { Button } from '@/components/ui/button';
import errorIcon from '@/assets/images/icon-error.svg';
import retryIcon from '@/assets/images/icon-retry.svg';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center" role="alert">
      <img src={errorIcon} alt="Error" className="w-16 h-16" aria-hidden="true" />
      <p className="text-neutral-600 text-lg max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <img src={retryIcon} alt="" className="w-4 h-4" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  );
}
