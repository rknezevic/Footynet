interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-[3px] border-red-600 p-6">
      <p className="text-sm text-red-900 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-red-900 hover:text-red-700 underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
