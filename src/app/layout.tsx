import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/UI/toaster";
import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
  title: "Text Behind Image",
  description: "Create stunning text behind image effects",
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.vercel-scripts.com https://va.vercel-scripts.com;
            script-src-elem 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.vercel-scripts.com https://va.vercel-scripts.com;
            connect-src 'self' https://checkout.razorpay.com https://va.vercel-insights.com https://*.vercel-scripts.com;
            style-src 'self' 'unsafe-inline';
            img-src 'self' blob: data:;
            font-src 'self';
            frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
            object-src 'none';
            base-uri 'self'
          `.replace(/\s+/g, ' ').trim()}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
        <Providers>
          <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container">
              <Navbar />
            </div>
          </div>
          <main className="flex-1 container mx-auto px-4 pt-20">
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}