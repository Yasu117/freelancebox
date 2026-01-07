import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | FreelanceBox',
    default: 'FreelanceBox | 案件提案型エージェント',
  },
  description: "案件提案型エージェント「FreelanceBox」。条件整理から案件提案まで、エージェントが伴走し、あなたに最適な案件をご提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
