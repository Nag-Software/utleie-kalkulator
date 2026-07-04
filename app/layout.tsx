import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Utleiekalkulator – beregn lønnsomhet på utleiebolig",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Gratis utleiekalkulator: beregn kontantstrøm, yield og avkastning på utleiebolig. Juster rente, leie og kostnader – se om utleie lønner seg.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-card">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-7" />
              {SITE_NAME}
            </Link>
            <nav className="flex items-center gap-5 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">
                Kalkulator
              </Link>
              <Link href="/guide" className="transition-colors hover:text-foreground">
                Guider
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-card">
          <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 text-sm text-muted-foreground">
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/guide" className="hover:text-foreground">
                Guider
              </Link>
              <Link href="/guide/yield-utleiebolig" className="hover:text-foreground">
                Yield på utleiebolig
              </Link>
              <Link href="/guide/skatt-pa-utleie-2026" className="hover:text-foreground">
                Skatt på utleie
              </Link>
              <Link href="/personvern" className="hover:text-foreground">
                Personvern
              </Link>
              <Link href="/vilkar" className="hover:text-foreground">
                Vilkår
              </Link>
            </nav>
            <p>
              Kalkulatoren er et hjelpemiddel og gir ikke finansiell rådgivning.
              Tallene er estimater basert på forutsetningene du selv legger inn.
            </p>
            <p>© {new Date().getFullYear()} Nag Software · utleie-kalkulator.no</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
