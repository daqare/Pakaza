'use client';
import { useState, useEffect } from 'react';

export default function ClientOnly({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center bg-pakaza-light"><p className="text-gray-500">Loading PAKAZA...</p></div>;
  }

  return <>{children}</>;
}
