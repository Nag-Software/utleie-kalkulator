import type { FaqItem } from "@/lib/faq";
import {
  COMPANY,
  CONTACT_EMAIL,
  KLIPP_PER_KJOP,
  KLIPP_PRIS_NOK,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

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
    name: COMPANY.legalName,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    email: CONTACT_EMAIL,
    telephone: COMPANY.phone,
    // Organisasjonsnummeret fra Enhetsregisteret; vatID utelates fordi
    // foretaket ikke er mva-registrert.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Organisasjonsnummer",
      value: COMPANY.organizationNumber,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: COMPANY.phone,
      email: CONTACT_EMAIL,
      areaServed: COMPANY.countryCode,
      availableLanguage: ["nb", "no"],
    },
    sameAs: [COMPANY.brregUrl],
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
      `Beregn kontantstrøm, yield og avkastning på utleiebolig. Gratis med manuelle tall; klippekort med ${KLIPP_PER_KJOP} FINN-importer for ${KLIPP_PRIS_NOK} kr.`,
    featureList: [
      "Kontantstrøm per måned etter skatt",
      "Brutto og netto yield",
      "Cash-on-cash-avkastning",
      "Break-even-leie og break-even-rente",
      "Flerårig prognose og amortisering",
      "Import av tall fra FINN-annonse",
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
        name: `Klippekort med ${KLIPP_PER_KJOP} FINN-importer`,
        price: KLIPP_PRIS_NOK,
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

/** ItemList over alle guider – hjelper søkemotorer å forstå guideindeksen. */
export function guideListJsonLd(
  guides: { slug: string; title: string; description: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guider om utleie og boliginvestering",
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}/guide/${guide.slug}`,
    })),
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
