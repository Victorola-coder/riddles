/**
 * Server-side utility functions for generating structured data (JSON-LD)
 * These can be called from Server Components
 */

/**
 * Generate structured data for the main website
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Riddle Quest',
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
    description:
      'A gamified riddle-solving platform where users progress through difficulty levels, earn virtual currency (Gems), and experience a premium, mysterious aesthetic.',
    url: 'https://riddle-quest.vercel.app',
    author: {
      '@type': 'Person',
      name: 'Victor',
      url: 'https://github.com/Victorola-coder',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Riddle Quest',
    },
  };
}

/**
 * Generate structured data for a specific riddle
 */
export function generateRiddleStructuredData(riddle: {
  id: string;
  question: string;
  answer: string | string[];
  difficulty: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: riddle.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: Array.isArray(riddle.answer) ? riddle.answer[0] : riddle.answer,
    },
    difficulty: riddle.difficulty,
    category: riddle.category || 'General',
  };
}
