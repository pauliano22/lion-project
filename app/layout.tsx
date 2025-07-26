import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Lion Project | AI Detection",
  description:
    "Protect yourself from AI deception with advanced deepfake detection technology. Real-time audio verification and authenticity protection.",
  icons: {
    icon: [
      { url: "/images/2.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }, // Add SVG option
    ],
    shortcut: "/images/2.png",
    apple: { url: "/images/2.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/2.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/images/2.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
