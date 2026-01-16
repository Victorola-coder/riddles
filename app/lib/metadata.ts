import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://riddle-quest.vercel.app';
const siteName = 'Riddle Quest';
const defaultDescription =
  'Solve riddles, earn gems, and progress through difficulty levels in this engaging gamified riddle platform. Challenge yourself with easy, medium, and hard riddles!';

/**
 * Generate metadata for a page
 */
export function generateMetadata({
  title,
  description = defaultDescription,
  path = '/',
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Gamified Riddle Platform`;
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/opengraph-image`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

/**
 * Generate metadata for a riddle page
 */
export function generateRiddleMetadata(riddle: {
  id: string;
  question: string;
  difficulty: string;
  category?: string;
}): Metadata {
  const title = `${riddle.difficulty.toUpperCase()} Riddle`;
  const description = `Can you solve this ${riddle.difficulty} riddle? ${riddle.question.substring(0, 100)}...`;
  const path = `/game?riddle=${riddle.id}`;

  return generateMetadata({
    title,
    description,
    path,
    image: `${baseUrl}/opengraph-image`,
  });
}
