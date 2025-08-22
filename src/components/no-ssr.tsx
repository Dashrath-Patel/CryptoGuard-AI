"use client";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "./loading-skeleton";

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders on the client side to prevent hydration issues
 * Follows Next.js documentation Solution 1: Using useEffect to run on the client only
 */
export function NoSSR({ children, fallback }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback || <LoadingSkeleton />;
  }

  return <>{children}</>;
}
