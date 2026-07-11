import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { getClientConfig } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export function generateMetadata(): Metadata {
  const config = getClientConfig();
  return {
    title: `${config.clientName} · Content Engine Performance`,
    description:
      "Live view of the content operation, read directly from the Notion blog tracker.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getClientConfig();
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      style={{ "--signal": config.accentColor } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
