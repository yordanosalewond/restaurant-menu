import { useRouter, ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { errorReporter } from '@/lib/errorReporter';
import { ErrorFallback } from './ErrorFallback';

export function RouteErrorBoundary({ error }: ErrorComponentProps) {
  useEffect(() => {
    // Report the route error
    if (error) {
      let errorMessage = 'Unknown route error';
      let errorStack = '';

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || '';
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      errorReporter.report({
        message: errorMessage,
        stack: errorStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        source: 'tanstack-router',
        error: error,
        level: "error",
      });
    }
  }, [error]);

  // Render error UI using shared ErrorFallback component
  return (
    <ErrorFallback
      title="Unexpected Error"
      message="An unexpected error occurred while loading this page."
      error={error}
      statusMessage="Routing error detected"
    />
  );
}