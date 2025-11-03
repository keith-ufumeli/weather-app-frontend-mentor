interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ 
  message = "How's the sky looking today?" 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
      <p className="text-neutral-600 text-lg">{message}</p>
      <p className="text-neutral-300 text-sm mt-2">Search for a city to get started</p>
    </div>
  );
}
