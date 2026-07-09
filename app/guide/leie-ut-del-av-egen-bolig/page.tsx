import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("leie-ut-del-av-egen-bolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Norges mest lønnsomme utleieform</h2>
      <p>
        Å leie ut hybel eller sokkelleilighet i boligen du selv bor i, er den
        eneste utleieformen der inntektene kan være <strong>helt
        skattefrie</strong>: leier du ut mindre enn halvparten av boligen,
        målt etter utleieverdi, betaler du null skatt på leieinntektene. En
        hybel til 8 000 kr i måneden gir da 96 000 kr rett i lomma per år –
        tilsvarende over 130 000 kr i brutto lønnsinntekt.{" "}
        <Link href="/guide/skatt-pa-utleie-2026">
          Reglene for skattefri utleie
        </Link>{" "}
        har detaljer og unntak, så sjekk at du er innenfor.
      </p>

      <h2>Er utleiedelen lovlig?</h2>
      <p>
        Rom som leies ut til beboelse må være <strong>godkjent for varig
        opphold</strong>. Det handler blant annet om takhøyde, rømningsvei
        (typisk vindu som er stort nok å komme seg ut av), dagslys og
        ventilasjon. En kjeller innredet som «bod med seng» er ikke lovlig
        utleie, og konsekvensene ved brann kan bli alvorlige – både
        menneskelig og forsikringsmessig. Skal du innrede kjeller eller loft,
        må du søke kommunen om bruksendring; kravene for eldre boliger ble
        forenklet i 2016. Direktoratet for byggkvalitet har oversikten over
        hva som kreves.
      </p>

      <h2>Kontrakt, depositum og oppsigelse</h2>
      <ul>
        <li>
          <strong>Skriftlig kontrakt</strong> – bruk gjerne Forbrukerrådets
          standardkontrakt, som balanserer begge parters rettigheter.
        </li>
        <li>
          <strong>Depositum:</strong> inntil seks måneders leie, på egen
          sperret depositumskonto i leietakers navn. Kontant «depositum» på
          din private konto er ulovlig.
        </li>
        <li>
          <strong>Leiejustering:</strong> KPI-regulering én gang i året med 30
          dagers varsel – se guiden om{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">riktig leiepris</Link>.
        </li>
        <li>
          <strong>Oppsigelse:</strong> husleieloven verner leietaker, men ved
          utleie av hybel med adgang til en bolig du selv bor i, står du som
          utleier noe friere enn ved utleie av selvstendig bolig.
        </li>
      </ul>

      <h2>Hybelen i lånesøknaden</h2>
      <p>
        En dokumentert leieinntekt fra egen bolig styrker betjeningsevnen når
        banken vurderer{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          boliglånet ditt
        </Link>
        . For mange førstegangskjøpere er en enebolig med utleiedel
        forskjellen på å få og ikke få finansiering – hybelinntekten
        fungerer i praksis som en fast «rentestøtte» hver måned.
      </p>

      <h2>Regn på hva hybelen faktisk gir deg</h2>
      <p>
        Skattefri utleie regnes enkelt i utleiekalkulatoren: legg inn
        leieinntekten, sett skattesatsen til 0, og før opp kostnadene som
        gjelder utleiedelen (strøm hvis inkludert, vedlikehold, litt
        ledighet). Da ser du netto månedlig effekt på økonomien – og hvor mye
        raskere du kan betale ned lånet.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: skatt ved utleie av bolig
          </a>
        </li>
        <li>
          <a
            href="https://www.dibk.no/bygge-eller-endre/bruksendring-i-eldre-boliger"
            rel="noopener noreferrer"
            target="_blank"
          >
            Direktoratet for byggkvalitet: bruksendring i eldre boliger
          </a>
        </li>
        <li>
          <a
            href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forbrukerrådet: husleiekontrakt
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
