import "./global.css";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { AOS } from "./components/global";
import { Cinzel, Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import StructuredData from "./components/global/structured-data";
import { generateWebsiteStructuredData } from "./lib/structured-data";
import { Providers } from "./providers";
import { ThemeProvider } from "./components/global/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://riddle-quest.vercel.app"),
  // icons: {
  //   icon: ["/icon-192.png"],
  //   apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  // },
  title: "Riddle Quest - Gamified Riddle Platform",
  description:
    "Solve riddles, earn gems, and progress through difficulty levels in this engaging gamified riddle platform. Challenge yourself with easy, medium, and hard riddles!",
  applicationName: "Riddle Quest",
  authors: [{ name: "Victor", url: "https://github.com/Victorola-coder" }],
  keywords: [
    "riddles",
    "puzzle",
    "game",
    "brain teasers",
    "gamification",
    "progressive web app",
    "nextjs",
    "typescript",
  ],
  creator: "Victor",
  publisher: "Victor",
  generator: "Next.js",
  referrer: "origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://riddle-quest.vercel.app",
    title: "Riddle Quest - Gamified Riddle Platform",
    siteName: "Riddle Quest",
    locale: "en_US",
    description:
      "Solve riddles, earn gems, and progress through difficulty levels. Challenge yourself with engaging brain teasers!",
    images: [
      {
        url: "https://riddle-quest.vercel.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Riddle Quest - Gamified Riddle Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riddle Quest - Gamified Riddle Platform",
    description:
      "Solve riddles, earn gems, and progress through difficulty levels. Challenge yourself with engaging brain teasers!",
    creator: "@Victorola-coder",
    images: ["https://riddle-quest.vercel.app/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    title: "Riddle Quest",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  abstract:
    "A gamified riddle-solving platform where users progress through difficulty levels, earn virtual currency (Gems), and experience a premium, mysterious aesthetic.",
  category: "Games",
  classification: "Entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${cinzel.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>
            <StructuredData data={generateWebsiteStructuredData()} />
            <Toaster richColors />
            <AOS />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
