import { Building2, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/site/primitives";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/jsonld";
import { COMPANY, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt oss",
  description:
    "Kontaktinformasjon for Nag Software, som driver utleie-kalkulator.no: organisasjonsnummer, adresse, telefon og e-post. Slik tar du kontakt om kjøp, refusjon eller reklamasjon.",
  alternates: { canonical: "/kontakt" },
};

const CHANNELS = [
  {
    icon: Mail,
    label: "E-post",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: "Foretrukket kanal. Vi svarer normalt innen én virkedag.",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: COMPANY.phoneFormatted,
    href: `tel:${COMPANY.phone}`,
    note: "Hverdager kl. 09–16. Legg igjen beskjed utenom åpningstid.",
  },
];

export default function KontaktPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Forside", path: "/" },
              { name: "Kontakt oss", path: "/kontakt" },
            ]),
          ),
        }}
      />

      <Pill>Kontakt</Pill>
      <h1 className="display mt-5 text-[clamp(2rem,5vw,2.75rem)]">
        Kontakt oss
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Utleie-kalkulator.no drives av {COMPANY.legalName}. Har du spørsmål om
        et kjøp, trenger refusjon eller vil melde en feil, når du oss her.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((channel) => (
          <div
            key={channel.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <channel.icon className="size-5 text-cta" aria-hidden />
            <p className="mt-4 text-[13px] font-medium text-muted-foreground">
              {channel.label}
            </p>
            <a
              href={channel.href}
              className="mt-1 block text-lg font-semibold tracking-[-0.02em] underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              {channel.value}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {channel.note}
            </p>
          </div>
        ))}
      </div>

      {/* Foretaksopplysninger – skal være enkle å finne for kunder og
          betalingsleverandører. */}
      <section
        aria-labelledby="foretaksopplysninger"
        className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <h2
          id="foretaksopplysninger"
          className="display-sm flex items-center gap-2 text-lg"
        >
          <Building2 className="size-5 text-cta" aria-hidden />
          Foretaksopplysninger
        </h2>
        <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-[13px] text-muted-foreground">Foretaksnavn</dt>
            <dd className="mt-0.5 font-medium">{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted-foreground">
              Organisasjonsnummer
            </dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {COMPANY.organizationNumberFormatted}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted-foreground">
              Organisasjonsform
            </dt>
            <dd className="mt-0.5 font-medium">{COMPANY.legalForm}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted-foreground">
              Merverdiavgift
            </dt>
            <dd className="mt-0.5 font-medium">
              Ikke registrert i Merverdiavgiftsregisteret
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              Forretningsadresse
            </dt>
            <dd className="mt-0.5 font-medium">
              {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city},{" "}
              {COMPANY.country}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Opplysningene kan kontrolleres i{" "}
          <a
            href={COMPANY.brregUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
          >
            Enhetsregisteret hos Brønnøysundregistrene
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="hva-gjelder" className="mt-12">
        <h2 id="hva-gjelder" className="display-sm text-xl">
          Hva gjelder henvendelsen?
        </h2>
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">
              Kjøp, kvittering eller klippekort:
            </strong>{" "}
            Send e-post med kvitteringen fra betalingsleverandøren. Klarer vi
            ikke å hente FINN-annonsen, brukes det ikke et klipp.
          </p>
          <p>
            <strong className="text-foreground">
              Reklamasjon eller klage:
            </strong>{" "}
            Beskriv hva som er feil, så svarer vi innen én virkedag og senest
            innen 14 dager. Se{" "}
            <Link
              href="/vilkar#reklamasjon"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              vilkårene om reklamasjon og konfliktløsning
            </Link>
            .
          </p>
          <p>
            <strong className="text-foreground">Personvern:</strong> Innsyn,
            retting eller sletting av opplysninger – se{" "}
            <Link
              href="/personvern"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              personvernerklæringen
            </Link>
            .
          </p>
          <p>
            <strong className="text-foreground">
              Feil i beregninger eller guider:
            </strong>{" "}
            Vi setter stor pris på tilbakemeldinger. Beskriv gjerne hvilke tall
            du brukte, så kan vi etterprøve regnestykket.
          </p>
        </div>
      </section>
    </div>
  );
}
