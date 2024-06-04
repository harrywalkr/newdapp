import 'normalize.css/normalize.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "@/components/layout/Header";
import Providers from "@/providers";
import { cn } from "@/lib/utils";
import { Footer } from '@/components/layout/Footer';
import Script from "next/script";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DexTrading",
  description: "Unlock advanced crypto trading insights with DexTrading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="ahrefs-site-verification" content="e0126c4c482c36a1009f59bdf25461160da3e532ae99fd5c060b217818d6f886" />
      </Head>
      <body className={cn(
        inter.className,
        'relative w-full'
      )}>
        <Providers>
          <main>
            <Header />
            {/* FIXME: fix min height when content is limited and footer is too close to the header and is in the middle of the screen */}
            <div className="my-28 md:mt-32 lg:mt-36 max-w-screen-2xl !mx-auto">
              {children}
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-EQXQQ1Z402" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-EQXQQ1Z402');
        `}
      </Script>
      <Script id="clarity-script">
        {`
          (function(c,l,a,r,i,t,y){ 
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; 
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; 
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); 
          })(window, document, "clarity", "script", "mih91n75t6"); 
        `}
      </Script>
    </html>
  );
}
