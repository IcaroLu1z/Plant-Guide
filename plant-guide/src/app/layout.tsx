// RootLayout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ClientLayout from "./client-layout"; // Importando o layout cliente


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plant-Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Toaster />
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
      </body>
    </html>
  );
}
