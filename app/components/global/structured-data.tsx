'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Component to inject structured data (JSON-LD) for SEO
 * Used for rich snippets in search results
 * This is a client component that safely injects JSON-LD into the document head
 */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';
    
    // Remove existing structured data if present
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
}
