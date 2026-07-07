import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} aria-hidden="true" />
);

export const CardSkeleton = () => (
  <div className="border border-gray-200 rounded-xl p-5 space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-8 w-24 mt-2" />
  </div>
);
