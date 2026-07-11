import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Toaster } from "@/components/ui/sonner";
import { jsonLdString, organizationJsonLd } from "@/lib/jsonld";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Utleiekalkulator – gratis kalkulator for utleiebolig (2026)",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Beregn kontantstrøm, yield og avkastning på utleiebolig på sekunder. Gratis utleiekalkulator uten konto – eller hent tallene rett fra FINN-annonsen.",
  applicationName: SITE_NAME,
  keywords: [
    "utleiekalkulator",
    "utleie kalkulator",
    "utleiebolig kalkulator",
    "avkastning utleiebolig",
    "yield utleiebolig",
    "kontantstrøm utleie",
    "leie ut bolig",
    "sekundærbolig",
    "lønner det seg å leie ut",
  ],
  category: "finance",
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
};

const FOOTER_GUIDES: { slug: string; label: string }[] = [
  { slug: "lonner-det-seg-a-kjope-utleiebolig", label: "Lønner utleie seg?" },
  { slug: "hva-kan-jeg-leie-ut-for", label: "Hva kan jeg leie ut for?" },
  { slug: "yield-utleiebolig", label: "Yield på utleiebolig" },
  { slug: "skatt-pa-utleie-2026", label: "Skatt på utleie" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Hopp til innhold
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(organizationJsonLd()),
          }}
        />
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
            >
              <Logo className="size-8" />
              {SITE_NAME}
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground sm:gap-8">
              <Link href="/" className="transition-colors hover:text-foreground">
                Kalkulator
              </Link>
              <Link
                href="/guide"
                className="transition-colors hover:text-foreground"
              >
                Guider
              </Link>
              <Link
                href="/om"
                className="hidden transition-colors hover:text-foreground sm:block"
              >
                Om
              </Link>
            </nav>
          </div>
        </header>
        <main id="innhold" className="flex-1">
          {children}
        </main>
        <footer className="mt-24 border-t border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
                >
                  <Logo className="size-8" />
                  {SITE_NAME}
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Se om utleieboligen lønner seg: kontantstrøm, yield og
                  avkastning – gratis og uten konto.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <nav aria-label="Guider" className="text-sm">
                <p className="eyebrow">Guider</p>
                <ul className="mt-4 space-y-2.5">
                  {FOOTER_GUIDES.map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        href={`/guide/${guide.slug}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {guide.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/guide"
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Alle guider →
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav aria-label="Om og vilkår" className="text-sm">
                <p className="eyebrow">Nettstedet</p>
                <ul className="mt-4 space-y-2.5">
                  <li>
                    <Link
                      href="/om"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Om kalkulatoren
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/personvern"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Personvern
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vilkar"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Vilkår
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Nag Software · utleie-kalkulator.no
              </p>
              <p className="max-w-md">
                Kalkulatoren er et hjelpemiddel og gir ikke finansiell
                rådgivning. Tallene er estimater basert på dine forutsetninger.
              </p>
            </div>
          </div>
        </footer>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
