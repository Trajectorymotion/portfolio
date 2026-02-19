import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { getContent } from "@/lib/actions";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const settings = content?.settings;

  return {
    title: settings?.site_name || "Trajectory motion",
    description: "Creative Video Editor portfolio",
    icons: {
      icon: settings?.favicon_url || "/favicontm.png",
      apple: settings?.favicon_url || "/favicontm.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  const settings = content?.settings;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="icon" href={settings?.favicon_url || "/favicontm.png"} />
        <link rel="apple-touch-icon" href={settings?.favicon_url || "/favicontm.png"} />
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
