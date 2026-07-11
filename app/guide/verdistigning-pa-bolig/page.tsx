import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("verdistigning-pa-bolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva har boligprisene steget historisk?</h2>
      <p>
        Norske boligpriser har steget markant i nominelle kroner de siste
        tretti årene – SSBs boligprisindeks viser en mangedobling siden tidlig
        på 1990-tallet. Men veksten har kommet <strong>ujevnt</strong>, med
        flere perioder der prisene sto stille eller falt. Historikken viser at
        boligpriser har steget over tid i et land med befolknings- og
        inntektsvekst; den lover ingenting om de neste fem–ti årene.
      </p>
      <p>
        Tre eksempler fra nyere norsk historie: den dype nedturen tidlig på{" "}
        <strong>1990-tallet</strong>, der det tok år før prisene hentet seg
        inn; <strong>Oslo-korreksjonen i 2017</strong> etter en kraftig
        oppgang; og <strong>renteoppgangen i 2022–23</strong>, som ga en flat
        til svakt negativ periode i store deler av landet. Den som kjøpte på
        topp, måtte i alle tre tilfellene vente. Indeksene finner du i{" "}
        <a
          href="https://www.ssb.no/priser-og-prisindekser/boligpriser-og-boligprisindekser"
          rel="noopener noreferrer"
          target="_blank"
        >
          SSBs boligprisstatistikk
        </a>
        .
      </p>

      <h2>Hva driver boligprisene?</h2>
      <ul>
        <li>
          <strong>Renten:</strong> lavere rente øker hvor mye folk får og tør
          å låne – og omvendt. Renteendringer er den faktoren som historisk
          har slått raskest inn i prisene.
        </li>
        <li>
          <strong>Inntektsvekst:</strong> over tid følger boligprisene
          husholdningenes betalingsevne.
        </li>
        <li>
          <strong>Byggetakt:</strong> bygges det færre boliger enn det flytter
          folk til området, presses prisene opp – og motsatt.
        </li>
        <li>
          <strong>Urbanisering:</strong> flyttestrømmer mot byene har løftet
          pressområdene mer enn distriktene.
        </li>
      </ul>
      <p>
        Ingen av driverne er konstante – det er derfor lange historiske snitt
        skjuler store forskjeller mellom perioder og steder.
      </p>

      <h2>Nominell og reell prisvekst er to forskjellige ting</h2>
      <p>
        <strong>Nominell</strong> vekst er endringen målt i kroner;{" "}
        <strong>reell</strong> vekst er etter inflasjon. Stiger boligen 5 % i
        et år med 3 % inflasjon, er realveksten rundt 2 %. Over lange perioder
        er realprisveksten på bolig klart lavere enn de nominelle tallene som
        oftest siteres – og det er realveksten som forteller om du faktisk er
        blitt rikere. Vær bevisst på hvilke tall du bruker i regnestykket:
        nominell leie, nominell rente og nominell verdistigning hører sammen.
      </p>

      <h2>Derfor bør kjøpet ikke hvile på verdistigning</h2>
      <p>
        Verdistigning er <strong>oppside, ikke fundament</strong>. Den kommer
        ujevnt, den er ikke garantert, og den realiseres først den dagen du
        selger eller refinansierer. I mellomtiden er det{" "}
        <Link href="/guide/kontantstrom-utleiebolig">kontantstrømmen</Link>{" "}
        som må bære boligen: renter, felleskostnader, vedlikehold og skatt
        forfaller hver måned uansett hva prisene gjør. En bolig som taper
        penger løpende «fordi verdistigningen tar det igjen», er et veddemål –
        og går markedet sidelengs i fem år, må du ha råd til å vente.
      </p>

      <h2>Slik bruker du verdistigning i regnestykket</h2>
      <p>
        Bruk en <strong>konservativ forutsetning</strong>, for eksempel 2–3 %
        nominell årlig vekst, og se på alt over det som bonus. Test også
        nullscenarioet: går regnestykket rundt helt uten verdistigning, står
        kjøpet støtt. Så mye betyr forutsetningen for en bolig til
        4 000 000 kr over ti år:
      </p>
      <table>
        <thead>
          <tr>
            <th>Årlig verdistigning</th>
            <th>Verdi etter 10 år</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0 %</td>
            <td>4 000 000 kr</td>
          </tr>
          <tr>
            <td>2,5 %</td>
            <td>ca. 5 100 000 kr</td>
          </tr>
          <tr>
            <td>5 %</td>
            <td>ca. 6 500 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Husk også bytteforholdet mellom løpende avkastning og prisvekst:
        pressområder har historisk gitt lav yield og sterkere verdistigning,
        mindre markeder det motsatte – les mer i guiden om{" "}
        <Link href="/guide/hvor-i-norge-er-yield-hoyest">
          hvor i Norge yield er høyest
        </Link>
        . Og skal du sammenligne totalavkastningen med alternativer, hører
        verdistigningen med i regnestykket – men med nøkterne tall, som i
        sammenligningen av{" "}
        <Link href="/guide/utleiebolig-vs-indeksfond">
          utleiebolig mot indeksfond
        </Link>
        .
      </p>

      <h2>Test følsomheten i kalkulatoren</h2>
      <p>
        I <Link href="/">utleiekalkulatoren</Link> setter du verdistigningen
        selv og ser prognosen for boligverdi, gjeld og egenkapital år for år –
        ved siden av kontantstrømmen etter skatt. Kjør samme bolig med 0 %,
        2,5 % og 4 % og se hvor mye av totalavkastningen som hviler på
        antakelsen: det er den raskeste måten å avsløre et kjøp som bare
        fungerer hvis prisene stiger. Kalkulatoren er gratis og krever ingen
        konto.
      </p>
    </ArticleLayout>
  );
}
