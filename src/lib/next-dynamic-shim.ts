
// This is a shim for next/dynamic to work in non-Next.js environments
import React, { lazy, Suspense } from 'react';

// Simple implementation of Next.js dynamic import
export default function dynamic(dynamicImport, options = {}) {
  const LoadableComponent = lazy(dynamicImport);
  
  return function DynamicComponent(props) {
    const fallback = options.loading || (() => null);
    return (
      <Suspense fallback={fallback()}>
        <LoadableComponent {...props} />
      </Suspense>
    );
  };
}
