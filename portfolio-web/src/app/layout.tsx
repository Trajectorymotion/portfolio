import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trajectory motion",
  description: "Creative Video Editor portfolio",
  icons: {
    icon: "/favicontm.png",
    apple: "/favicontm.png",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicontm.png" />
        <link rel="apple-touch-icon" href="/favicontm.png" />
      </head>
      <body
        className={`${geistMono.variable} antialiased bg-background text-foreground transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextTopLoader
            color="#ffffff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #ffffff,0 0 5px #ffffff"
          />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
