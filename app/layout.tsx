import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Toaster } from "@/components/ui/sonner";
import { jsonLdString, organizationJsonLd } from "@/lib/jsonld";
import { COMPANY, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  themeColor: "#fbfaf9",
};

const NAV_LINKS: { href: string; label: string; hideOnMobile?: boolean }[] = [
  { href: "/", label: "Kalkulator" },
  { href: "/guide", label: "Guider" },
  { href: "/om", label: "Om", hideOnMobile: true },
];

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
    <html lang="nb" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Hopp til innhold
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(organizationJsonLd()),
          }}
        />

        <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold tracking-[-0.03em] sm:text-[17px]"
            >
              <Logo className="size-7" />
              {SITE_NAME}
            </Link>
            <nav className="flex items-center gap-0.5 sm:gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-3 ${
                    link.hideOnMobile ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/klippekort"
                className="ml-1 hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:inline-flex"
              >
                Ditt klippekort
              </Link>
            </nav>
          </div>
        </header>

        <main id="innhold" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.03em]"
                >
                  <Logo className="size-7" />
                  {SITE_NAME}
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Se om utleieboligen lønner seg: kontantstrøm, yield og
                  avkastning – gratis og uten konto.
                </p>
                {/* Firma- og kontaktinformasjon skal være godt synlig
                    (krav fra betalingsleverandør). */}
                <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {COMPANY.legalName}
                  </p>
                  <p>Org.nr. {COMPANY.organizationNumberFormatted}</p>
                  <p>{COMPANY.street}</p>
                  <p>
                    {COMPANY.postalCode} {COMPANY.city}, {COMPANY.country}
                  </p>
                  <p>
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {COMPANY.phoneFormatted}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </address>
              </div>
              <nav aria-label="Guider" className="text-sm">
                <p className="text-[13px] font-semibold">Guider</p>
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
                <p className="text-[13px] font-semibold">Nettstedet</p>
                <ul className="mt-4 space-y-2.5">
                  <li>
                    <Link
                      href="/klippekort"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Klippekortet ditt
                    </Link>
                  </li>
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
                      href="/kontakt"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Kontakt oss
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
                      Salgsvilkår
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {COMPANY.legalName} · Org.nr.{" "}
                {COMPANY.organizationNumberFormatted} · utleie-kalkulator.no
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
