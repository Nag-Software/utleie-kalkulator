import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("arvet-bolig-leie-ut-eller-selge");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Skatten først: inngangsverdien din avgjør</h2>
      <p>
        Norge har <strong>ingen arveavgift</strong> (fjernet i 2014), så selve
        arven utløser ingen skatt. Det som betyr noe, er{" "}
        <strong>inngangsverdien</strong> du overtar boligen med. Kunne avdøde
        ha solgt boligen skattefritt – typisk egen bolig med botid – settes
        din inngangsverdi til <strong>markedsverdien ved dødsfallet</strong>{" "}
        (diskontinuitet). Kunne avdøde ikke solgt skattefritt, for eksempel en
        utleiebolig avdøde aldri bodde i, overtar du avdødes inngangsverdi
        (kontinuitet) – og dermed også en latent, skattepliktig gevinst.
      </p>

      <h2>Selger du raskt, er gevinsten ofte null</h2>
      <p>
        Med markedsverdi ved dødsfallet som inngangsverdi blir gevinsten ved
        et salg kort tid etter arveoppgjøret gjerne tilnærmet null – salgssum
        og inngangsverdi er omtrent like, og skatten blir minimal. Venter du
        og leier ut i noen år, bygger du derimot{" "}
        <strong>skattepliktig gevinst</strong>: verdistigningen fra
        arvetidspunktet beskattes med 22 % ved salg, med mindre du selv
        flytter inn og opparbeider botid. Reglene er forklart i guiden om{" "}
        <Link href="/guide/skatt-ved-salg-av-utleiebolig">
          skatt ved salg av utleiebolig
        </Link>
        . Dette er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om salg av bolig og eiendom
        </a>{" "}
        for detaljene om inngangsverdi ved arv.
      </p>

      <h2>Regnestykket for å beholde: yield på dagens markedsverdi</h2>
      <p>
        En arvet bolig føles gratis, men det er den ikke: å beholde den er å
        velge bort salgssummen. Du investerer i praksis hele dagens
        markedsverdi i utleie – og da må avkastningen måles mot den verdien,
        ikke mot null i kjøpesum.
      </p>
      <table>
        <thead>
          <tr>
            <th>Eksempel: arvet leilighet</th>
            <th>Tall</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Markedsverdi i dag</td>
            <td>3 500 000 kr</td>
          </tr>
          <tr>
            <td>Månedsleie</td>
            <td>14 000 kr</td>
          </tr>
          <tr>
            <td>Leieinntekt per år</td>
            <td>168 000 kr</td>
          </tr>
          <tr>
            <td>Brutto yield</td>
            <td>4,8 %</td>
          </tr>
          <tr>
            <td>Netto yield (typisk 1–1,5 prosentpoeng lavere)</td>
            <td>ca. 3,3–3,8 %</td>
          </tr>
        </tbody>
      </table>
      <p>
        Spørsmålet er om rundt 3,5 % netto, pluss eventuell verdistigning, er
        god nok betaling for arbeidet og risikoen ved utleie – sammenlignet
        med å selge tilnærmet skattefritt og plassere 3,5 millioner på annen
        måte. Hvordan du regner og vurderer nivået, står i guiden om{" "}
        <Link href="/guide/yield-utleiebolig">yield på utleiebolig</Link>.
      </p>

      <h2>Vedlikeholdsstand og følelser mot tall</h2>
      <p>
        To ting skiller arveboliger fra kjøpte utleieboliger. Den første er{" "}
        <strong>vedlikeholdsstanden</strong>: mange arveboliger har etterslep
        på bad, kjøkken, tak eller elektrisk anlegg. Et etterslep på
        400 000 kr hører med i regnestykket uansett hva du velger – som
        lavere salgspris hvis du selger, eller som investering og lavere leie
        frem til utbedring hvis du beholder. Den andre er{" "}
        <strong>følelsene</strong>: et barndomshjem er mer enn et regneark, og
        det er legitimt å vektlegge. Men ta valget med åpne øyne – leietakere
        sliter på boligen, og en utleieinvestering som ikke går rundt, blir
        ikke bedre av å være kjær.
      </p>

      <h2>Flere arvinger? Avklar sameiet først</h2>
      <p>
        Arver du sammen med søsken, eier dere boligen i <strong>sameie</strong>{" "}
        etter arvebrøken. Utleie krever da enighet om hvem som drifter,
        hvordan leien fordeles (den beskattes hos hver eier etter eierandel)
        og – viktigst – en exitplan for den dagen én vil selge. Skriv en
        sameieavtale før første leietaker flytter inn; punktene er de samme
        som når man{" "}
        <Link href="/guide/kjope-utleiebolig-sammen-med-andre">
          kjøper utleiebolig sammen med andre
        </Link>
        . Alternativet er at én arving løser ut de andre til markedsverdi og
        driver alene.
      </p>

      <h2>Sett tallene inn i kalkulatoren</h2>
      <p>
        Legg inn dagens markedsverdi som kjøpesum, lånet du eventuelt må ta
        opp for å løse ut medarvinger, realistisk leie og alle kostnader. Da
        ser du kontantstrøm etter skatt og yield på verdien du faktisk binder
        opp – og kan sammenligne med alternativet: å selge nå, med en gevinst
        nær null. Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
