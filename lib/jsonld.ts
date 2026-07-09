import type { FaqItem } from "@/lib/faq";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [
      "Utleiekalkulator",
      "Utleie kalkulator",
      "utleie-kalkulator.no",
    ],
    url: SITE_URL,
    inLanguage: "nb-NO",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nag Software",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    email: CONTACT_EMAIL,
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Utleiekalkulator",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "nb-NO",
    description:
      "Beregn kontantstrøm, yield og avkastning på utleiebolig. Gratis med manuelle tall; automatisk import fra FINN-annonse med KI-vurdering for 9,90 kr.",
    featureList: [
      "Kontantstrøm per måned etter skatt",
      "Brutto og netto yield",
      "Cash-on-cash-avkastning",
      "Break-even-leie og break-even-rente",
      "Flerårig prognose og amortisering",
      "Import fra FINN-annonse med KI-vurdering",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Manuell beregning",
        price: "0",
        priceCurrency: "NOK",
      },
      {
        "@type": "Offer",
        name: "FINN-import med KI-vurdering",
        price: "9.90",
        priceCurrency: "NOK",
      },
    ],
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: "nb-NO",
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/guide/${article.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Serialisering for <script type="application/ld+json"> (XSS-trygg). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
