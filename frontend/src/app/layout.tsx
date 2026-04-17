import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import NavPill from "@/components/NavPill";
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
  title: "AegisGuard.init — AI-Powered Security Appchain",
  description:
    "Real-time interceptor for Initia auto-signing transactions. Captures malicious payloads with zero false positives.",
  metadataBase: new URL("https://aegisguard-init.vercel.app"),
  openGraph: {
    title: "AegisGuard.init — AI-Powered Security Appchain",
    description:
      "Real-time interceptor for Initia auto-signing transactions. Captures malicious payloads with zero false positives.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AegisGuard.init — AI-Powered Security Appchain",
    description:
      "Real-time interceptor for Initia auto-signing transactions. Captures malicious payloads with zero false positives.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground noise-overlay">
        <Providers>
          <NavPill />
          {children}
        </Providers>
      </body>
    </html>
  );
}
