'use client';

import { ErrorMessage } from '@/components/ErrorMessage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ErrorMessage
        title="Something went wrong!"
        message={error.message}
        retry={() => reset()}
      />
    </div>
  );
} 