import 'normalize.css/normalize.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "@/components/layout/Header";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.className,
        'relative w-full'
      )}>
        <Providers>
          <main className="mt-28 md:mt-32 lg:mt-36 max-w-screen-2xl !mx-auto">
            <Header />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
