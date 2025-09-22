import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hivemind-sist.tech'),
  title: {
    default: "HiveMind - AI community",
    template: "%s | HiveMind"
  },
  description: "HiveMind - a vibrant AI community at Sathyabama Institute of Science and Technology, where students collaborate, innovate, and explore cutting-edge artificial intelligence projects.",
  keywords: ['HiveMind', 'community', 'SIST', 'AI', 'collaboration', 'networking', 'ideas'],
  authors: [{ name: 'Kishor Ramanan', url: 'https://kishorramanan.com' }],
  creator: 'Kishor',
  openGraph: {
    title: "HiveMind - AI Community at SIST",
    description: "A vibrant AI community at Sathyabama Institute of Science and Technology, where students collaborate, innovate, and explore cutting-edge artificial intelligence projects.",
    url: 'https://hivemind-sist.tech',
    siteName: 'HiveMind',
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: 'HiveMind Logo',
      },
    ],
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
