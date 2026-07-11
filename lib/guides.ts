import type { Metadata } from "next";

/**
 * Kategorier for guidene, i visningsrekkefølge på /guide.
 * Rekkefølgen følger leserens reise: vurdere kjøp → regne på det →
 * finansiere → skatt → drifte → regelverk → spesialtilfeller → marked.
 */
export const GUIDE_CATEGORIES = [
  {
    id: "kjop",
    label: "Kjøp og lønnsomhet",
    blurb:
      "Fra første vurdering til bud: sjekklister, verdivurdering og fellene å unngå.",
  },
  {
    id: "avkastning",
    label: "Yield og avkastning",
    blurb:
      "Tallene som avgjør: yield, kontantstrøm, cash-on-cash og break-even.",
  },
  {
    id: "finansiering",
    label: "Lån og finansiering",
    blurb:
      "Egenkapital, utlånsforskriften, rente og strukturen på lånet.",
  },
  {
    id: "skatt",
    label: "Skatt",
    blurb:
      "Satser, fradrag, skattefri utleie og rapportering – for norske utleiere.",
  },
  {
    id: "drift",
    label: "Utleie i praksis",
    blurb:
      "Kontrakt, depositum, leietakere og alt det praktiske i leieforholdet.",
  },
  {
    id: "regler",
    label: "Regler og krav",
    blurb:
      "Husleieloven, borettslag og sameie, og kravene til lovlig utleiedel.",
  },
  {
    id: "korttid",
    label: "Korttidsutleie og hytte",
    blurb: "Airbnb, hytteutleie og regnestykket mot langtidsutleie.",
  },
  {
    id: "marked",
    label: "Leiepriser og marked",
    blurb:
      "Leiepriser, markedsleie og hvor i landet regnestykket går opp.",
  },
] as const;

export type GuideCategory = (typeof GUIDE_CATEGORIES)[number]["id"];

export function getCategory(id: GuideCategory) {
  const category = GUIDE_CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Ukjent guide-kategori: ${id}`);
  return category;
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  category: GuideCategory;
}

/**
 * Alle guider. Forsiden viser de tre første; /guide grupperer på kategori.
 * Sitemap, guide-indeks, footer, llms.txt og artikkel-layout leser herfra.
 */
export const GUIDES: GuideMeta[] = [
  {
    slug: "lonner-det-seg-a-kjope-utleiebolig",
    title: "Lønner det seg å kjøpe bolig for utleie? (2026)",
    description:
      "Regnestykket bak en utleiebolig: yield mot lånerente, kontantstrøm, avdrag og verdistigning – og kostnadene folk glemmer. Med konkrete eksempler.",
    datePublished: "2026-07-06",
    category: "kjop",
  },
  {
    slug: "hva-kan-jeg-leie-ut-for",
    title: "Hva kan jeg leie ut for? Slik setter du riktig leiepris",
    description:
      "Finn markedsleien med FINN-metoden og SSBs leiestatistikk, se hva som drar prisen opp, og hvorfor én måned tomgang koster mer enn litt lavere leie.",
    datePublished: "2026-07-06",
    category: "marked",
  },
  {
    slug: "yield-utleiebolig",
    title: "Yield på utleiebolig: slik regner du ut avkastningen (2026)",
    description:
      "Brutto vs. netto yield, regneeksempler steg for steg, og hva som regnes som god avkastning i store og små byer.",
    datePublished: "2026-07-04",
    category: "avkastning",
  },
  {
    slug: "skatt-pa-utleie-2026",
    title: "Skatt på utleie 2026: satser, fradrag og skattefri utleie",
    description:
      "22 % på netto leieinntekt, alle fradragene du kan kreve, halvparten-regelen for egen bolig og reglene for korttidsutleie.",
    datePublished: "2026-07-04",
    category: "skatt",
  },
  {
    slug: "egenkapital-og-lan-til-utleiebolig",
    title: "Lån til utleiebolig: egenkapital, krav og rente (2026)",
    description:
      "Hvor mye egenkapital krever banken for en utleiebolig? Utlånsforskriftens krav, hvordan leieinntekter teller med, og fellene i borettslag.",
    datePublished: "2026-07-06",
    category: "finansiering",
  },
  {
    slug: "leie-ut-del-av-egen-bolig",
    title: "Leie ut del av egen bolig: hybel, sokkel og skattefritt",
    description:
      "Slik leier du ut hybel eller sokkelleilighet skattefritt: halvparten-regelen, krav til utleiedelen, kontrakt og depositum – og hva det betyr for økonomien.",
    datePublished: "2026-07-06",
    category: "skatt",
  },
  {
    slug: "airbnb-og-korttidsutleie",
    title: "Airbnb og korttidsutleie: skatt og regler (2026)",
    description:
      "10 000-kronersgrensen og 85 %-regelen forklart, 30-døgnsgrensen i borettslag og 90-døgnsgrensen i sameie – og når korttidsutleie blir virksomhet.",
    datePublished: "2026-07-10",
    category: "korttid",
  },
  {
    slug: "utleiemegler-eller-leie-ut-selv",
    title: "Utleiemegler eller leie ut selv? Pris og regnestykke (2026)",
    description:
      "Hva utleiemegler og forvaltning faktisk koster (typisk 8–12 % av leien + mva), hva du får for pengene, og hvordan du regner effekten inn i kontantstrømmen.",
    datePublished: "2026-07-10",
    category: "drift",
  },
  {
    slug: "dokumentavgift-og-omkostninger",
    title: "Dokumentavgift og omkostninger ved boligkjøp",
    description:
      "2,5 %-regelen for selveier, hvorfor borettslag slipper, tinglysingsgebyrer og hva kjøpet faktisk koster totalt.",
    datePublished: "2026-07-04",
    category: "kjop",
  },

  // ── Kjøp og lønnsomhet ────────────────────────────────────────────────
  {
    slug: "forste-utleiebolig-sjekkliste",
    title: "Kjøpe din første utleiebolig: sjekkliste i 10 steg",
    description:
      "Fra finansieringsbevis til første leietaker: en praktisk rekkefølge for deg som vil inn i utleiemarkedet uten dyre nybegynnerfeil.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "vanlige-feil-utleieinvestorer",
    title: "7 vanlige feil når du kjøper utleiebolig",
    description:
      "Glemte kostnader, for optimistisk leie, null buffer for tomgang og kjøp med hjertet: feilene som ødelegger avkastningen – og hvordan du unngår dem.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "verdivurdering-av-utleiebolig",
    title: "Hva er en utleiebolig verdt? Verdivurdering med yield",
    description:
      "Bruk yield-metoden og sammenlignbare salg til å regne ut hva boligen er verdt som investering – og når du bør by under prisantydning.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "oppussingsobjekt-som-utleiebolig",
    title: "Oppussingsobjekt som utleiebolig: regnestykket",
    description:
      "Kjøpe slitt, pusse opp og leie ut: budsjett med buffer, skattereglene for oppussing, og hvordan du regner hjem gevinsten – med tall.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "kjope-utleiebolig-med-leietaker",
    title: "Kjøpe bolig med leietaker: fordeler og feller",
    description:
      "Leiekontrakten følger boligen ved eierskifte. Hva du må sjekke før bud: kontraktstype, depositum, leienivå mot marked og betalingshistorikk.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "kjope-utleiebolig-sammen-med-andre",
    title: "Kjøpe utleiebolig sammen med andre",
    description:
      "Venner, søsken eller samboer: eierbrøk, sameieavtale, skattefordeling og exit-plan – alt som bør avtales før dere legger inn bud.",
    datePublished: "2026-07-11",
    category: "kjop",
  },
  {
    slug: "arvet-bolig-leie-ut-eller-selge",
    title: "Arvet bolig: leie ut eller selge?",
    description:
      "Inngangsverdi ved arv, gevinstskatt hvis du venter med å selge, og regnestykket som viser om arveboligen er en god utleieinvestering.",
    datePublished: "2026-07-11",
    category: "kjop",
  },

  // ── Yield og avkastning ───────────────────────────────────────────────
  {
    slug: "kontantstrom-utleiebolig",
    title: "Kontantstrøm på utleiebolig: slik regner du",
    description:
      "Den komplette oppstillingen fra brutto leie til kroner på konto etter skatt – med eksempel, vanlige glemte poster og hva som er god kontantstrøm.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },
  {
    slug: "cash-on-cash-avkastning",
    title: "Cash-on-cash: avkastningen på egenkapitalen",
    description:
      "Yield måler boligen, cash-on-cash måler pengene dine. Formelen, regneeksempler med ulik belåning og fellene i tallet.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },
  {
    slug: "break-even-for-utleiebolig",
    title: "Break-even på utleiebolig: hvor mye tåler du?",
    description:
      "Break-even-leie og break-even-rente viser hvor mye som skal til før du taper penger hver måned. Slik stresstester du kjøpet før budrunden.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },
  {
    slug: "gearing-og-belaningsgrad",
    title: "Gearing: slik forsterker lån avkastningen (og tapet)",
    description:
      "Samme bolig, tre ulike belåningsgrader: se hvordan gearing løfter egenkapitalavkastningen i gode år og forsterker tapet når det butter.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },
  {
    slug: "utleiebolig-vs-indeksfond",
    title: "Utleiebolig eller indeksfond? En ærlig sammenligning",
    description:
      "Historisk avkastning, gearing, skatt, arbeidsinnsats og risiko – en nøktern sammenligning som viser når utleiebolig slår fond, og når den ikke gjør det.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },
  {
    slug: "verdistigning-pa-bolig",
    title: "Verdistigning på bolig: hva kan du egentlig forvente?",
    description:
      "Hva boligprisene historisk har steget, hvorfor fremtiden ikke er garantert lik, og hvordan verdistigning bør – og ikke bør – brukes i utleieregnestykket.",
    datePublished: "2026-07-11",
    category: "avkastning",
  },

  // ── Lån og finansiering ───────────────────────────────────────────────
  {
    slug: "sekundaerbolig-krav-og-regler",
    title: "Sekundærbolig: krav, skatt og regler (2026)",
    description:
      "Hva som regnes som sekundærbolig, utlånsforskriftens krav til egenkapital, formuesverdsettelse på 100 % og forskjellene mot primærbolig.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "utleiebolig-gjennom-as",
    title: "Utleiebolig i AS eller privat? Skatt og regnestykke",
    description:
      "22 % skatt i selskapet, utbytteskatt ved uttak, dokumentavgift ved overføring og når AS faktisk lønner seg – med konkrete regneeksempler.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "refinansiere-for-a-kjope-utleiebolig",
    title: "Refinansiering: frigjør egenkapital til utleiebolig",
    description:
      "Slik bruker du verdistigning i egen bolig som egenkapital til utleiebolig – med utlånsforskriftens grenser og et ærlig risikobilde.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "rentefradrag-pa-utleielan",
    title: "Rentefradrag på lån til utleiebolig",
    description:
      "Gjeldsrenter gir 22 % fradrag uansett hva lånet finansierer. Se hvordan rentefradraget senker den effektive lånekostnaden i utleieregnestykket.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "avdragsfrihet-pa-utleiebolig",
    title: "Avdragsfrihet på utleiebolig: smart eller felle?",
    description:
      "Avdragsfrihet bedrer kontantstrømmen, men bygger ikke formue. Når det er et verktøy, når det er et faresignal – og hva utlånsforskriften tillater.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "fastrente-eller-flytende-rente-utleie",
    title: "Fastrente eller flytende rente på utleielån?",
    description:
      "Renterisiko er den største trusselen mot kontantstrømmen. Fordeler, ulemper, overkurs og hvordan du stresstester økonomien mot renteøkning.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },
  {
    slug: "fellesgjeld-og-felleskostnader",
    title: "Fellesgjeld og felleskostnader: det fulle regnestykket",
    description:
      "Lav pris og høy fellesgjeld kan lure deg. Totalpris, IN-ordning, avdragsfri fellesgjeld som senere dobles – og hva du må sjekke i regnskapet.",
    datePublished: "2026-07-11",
    category: "finansiering",
  },

  // ── Skatt ─────────────────────────────────────────────────────────────
  {
    slug: "fradrag-ved-utleie",
    title: "Fradrag ved utleie: komplett liste (2026)",
    description:
      "Alle kostnadene du kan trekke fra i leieinntekten: felleskostnader, vedlikehold, forsikring, møbler, reise og mer – og dokumentasjonen du trenger.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "skattemelding-leieinntekter",
    title: "Leieinntekter i skattemeldingen: slik fører du dem",
    description:
      "Steg for steg: hvor leieinntekter og fradrag føres i skattemeldingen, hvordan underskudd behandles, og feilene som oftest gir spørsmål fra Skatteetaten.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "nar-blir-utleie-naeringsvirksomhet",
    title: "Når blir utleie næringsvirksomhet? Femboligregelen",
    description:
      "Tommelfingerregelen om fem boenheter, hvorfor korttidsutleie vurderes strengere, og hva næringsbeskatning faktisk betyr for skatten din.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "skatt-ved-salg-av-utleiebolig",
    title: "Skatt ved salg av utleiebolig: gevinst og botid",
    description:
      "22 % skatt på gevinsten, botidsregelen som kan gjøre salget skattefritt, hvordan inngangsverdien beregnes – og lovlige grep som reduserer skatten.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "formuesskatt-pa-utleiebolig",
    title: "Formuesskatt på utleiebolig: slik slår den ut",
    description:
      "Sekundærbolig verdsettes til 100 % av beregnet markedsverdi. Se hvordan formuesskatten regnes, hva gjelden betyr, og effekten på totalavkastningen.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "utleie-til-familie-og-barn",
    title: "Leie ut til familie: skatteregler og fallgruver",
    description:
      "Kan du leie ut billig til egne barn? Reglene i og utenfor egen bolig, hvorfor lav leie kan koste fradragene – og foreldrekjøp i praksis.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "vedlikehold-eller-pakostning",
    title: "Vedlikehold eller påkostning? Skattereglene forklart",
    description:
      "Vedlikehold gir fradrag nå, påkostning først ved salg. Lær grensen, regelen om «tenkt vedlikehold» og hvordan du dokumenterer oppussingen riktig.",
    datePublished: "2026-07-11",
    category: "skatt",
  },
  {
    slug: "underskudd-pa-utleie",
    title: "Underskudd på utleie: slik fungerer skattefradraget",
    description:
      "Når renter og kostnader overstiger leien, gir underskuddet 22 % fradrag i annen inntekt. Se regnestykket – og når negativ kontantstrøm er greit.",
    datePublished: "2026-07-11",
    category: "skatt",
  },

  // ── Utleie i praksis ──────────────────────────────────────────────────
  {
    slug: "leiekontrakt-dette-ma-den-inneholde",
    title: "Leiekontrakt ved utleie: dette må den inneholde",
    description:
      "Punktene en leiekontrakt bør ha: leie, depositum, varighet, oppsigelse, vedlikeholdsansvar og husordensregler – og tabbene som koster utleiere dyrt.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "depositum-regler-og-depositumskonto",
    title: "Depositum: regler, konto og vanlige feil (2026)",
    description:
      "Maks seks måneders leie, egen depositumskonto i leietakers navn, hvem som betaler gebyret og hva som skjer ved uenighet om trekk.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "finne-og-velge-leietaker",
    title: "Slik finner du riktig leietaker",
    description:
      "Annonse som treffer, visning, referansesjekk og kredittvurdering – og diskrimineringsreglene som sier hva du ikke kan legge vekt på.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "husleieokning-slik-gjor-du-det",
    title: "Husleieøkning: KPI-justering og gjengs leie",
    description:
      "Én KPI-justering i året med én måneds varsel, gjengs leie etter tre år – slik øker du leien lovlig, med frister og ferdig fremgangsmåte.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "oppsigelse-av-leieforhold",
    title: "Oppsigelse av leieforhold: frister og formkrav",
    description:
      "Oppsigelsestid, saklig grunn, formkravene som gjør oppsigelsen gyldig og hva som skjer hvis leietaker protesterer – for begge kontraktstyper.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "nar-leietaker-ikke-betaler",
    title: "Leietaker betaler ikke: purring, varsel og utkastelse",
    description:
      "Riktig rekkefølge fra purring til namsmann: utkastelsesklausul, § 4-18-varsel, tidslinje og kostnader – og hvordan depositumet dekker tapet.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "utleieforsikring-verdt-det",
    title: "Utleieforsikring: hva dekker den og hva koster den?",
    description:
      "Husleietap, skadeverk og rettshjelp: hva utleieforsikring faktisk dekker, typisk pris – og når vanlig husforsikring og depositum er nok.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "slitasje-eller-skade",
    title: "Normal slitasje eller skade? Grensen ved utflytting",
    description:
      "Hva du kan trekke fra depositumet og hva som er normal slitasje du selv må bære – med typiske eksempler og læren fra Husleietvistutvalget.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "moblert-eller-umoblert-utleie",
    title: "Møblert eller umøblert utleie: hva lønner seg?",
    description:
      "Leiepåslag, målgruppe, slitasje og skattefradrag for møblene – regnestykket som viser når møblering faktisk betaler seg.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "overtakelsesprotokoll",
    title: "Overtakelsesprotokoll: sjekkliste ved inn- og utflytting",
    description:
      "Protokollen som avgjør depositumstvister: hva den skal dokumentere, bilder som holder i Husleietvistutvalget og en ferdig sjekkliste.",
    datePublished: "2026-07-11",
    category: "drift",
  },
  {
    slug: "vedlikeholdsbudsjett-utleiebolig",
    title: "Vedlikehold av utleiebolig: hvor mye bør du sette av?",
    description:
      "Tommelfingerregler for vedlikeholdsbudsjett, levetiden på bad, kjøkken og hvitevarer – og hvorfor kalkyler uten vedlikehold alltid ser for gode ut.",
    datePublished: "2026-07-11",
    category: "drift",
  },

  // ── Regler og krav ────────────────────────────────────────────────────
  {
    slug: "husleieloven-for-utleiere",
    title: "Husleieloven: de viktigste reglene for utleiere",
    description:
      "Lovens ufravikelige regler: depositum, leieøkning, oppsigelsesvern, vedlikeholdsplikt og leietakers rettigheter – kort forklart for deg som leier ut.",
    datePublished: "2026-07-11",
    category: "regler",
  },
  {
    slug: "utleie-i-borettslag",
    title: "Utleie i borettslag: regler og treårsgrensen",
    description:
      "Bruksoverlating krever styrets samtykke: hovedregelen om ett års botid og tre års utleie, unntakene og 30-døgnsgrensen for korttidsutleie.",
    datePublished: "2026-07-11",
    category: "regler",
  },
  {
    slug: "utleie-i-sameie",
    title: "Utleie i eierseksjonssameie: hvilke regler gjelder?",
    description:
      "I sameie kan du i utgangspunktet leie ut fritt. Unntakene: korttidsgrensen på 90 døgn, vedtektene og styrets rolle – og hvorfor investorer velger selveier.",
    datePublished: "2026-07-11",
    category: "regler",
  },
  {
    slug: "krav-til-godkjent-utleiedel",
    title: "Krav til godkjent utleiedel: dette sier reglene",
    description:
      "Rom for varig opphold: takhøyde, dagslys, rømningsvei, radon og ventilasjon – kravene til lovlig utleie og risikoen ved å leie ut ulovlig.",
    datePublished: "2026-07-11",
    category: "regler",
  },
  {
    slug: "bruksendring-kjeller-til-utleiedel",
    title: "Bruksendring: fra kjeller til godkjent utleiedel",
    description:
      "Slik søker du bruksendring fra bod eller kjeller til beboelsesrom: de forenklede kravene for eldre boliger, kostnadene og om investeringen lønner seg.",
    datePublished: "2026-07-11",
    category: "regler",
  },
  {
    slug: "brannsikkerhet-og-radon",
    title: "Brannsikkerhet og radon: utleiers plikter",
    description:
      "Røykvarslere, slukkeutstyr, rømningsveier og radonmåling med tiltaksgrense på 100 Bq/m³ – pliktene du har som utleier, og hva de koster.",
    datePublished: "2026-07-11",
    category: "regler",
  },

  // ── Korttidsutleie og hytte ───────────────────────────────────────────
  {
    slug: "korttidsutleie-vs-langtidsutleie",
    title: "Korttidsutleie eller langtidsutleie: hva lønner seg?",
    description:
      "Airbnb kan gi det dobbelte i brutto – før belegg, gebyrer, rengjøring og skatt. Det ærlige regnestykket som viser når korttid faktisk vinner.",
    datePublished: "2026-07-11",
    category: "korttid",
  },
  {
    slug: "utleie-av-hytte",
    title: "Leie ut hytta: skatt, sesong og regnestykke",
    description:
      "10 000 kr skattefritt og 85 %-regelen for fritidsbolig du selv bruker, sesongbelegg og hva utleien realistisk kan dekke av hyttekostnadene.",
    datePublished: "2026-07-11",
    category: "korttid",
  },

  // ── Leiepriser og marked ──────────────────────────────────────────────
  {
    slug: "leiepriser-oslo",
    title: "Leiepriser i Oslo 2026: hva kan du ta i leie?",
    description:
      "Typiske leienivåer for hybel, 2-roms og 3-roms i Oslo, forskjellene mellom bydelene og hvordan du finner riktig leie for din bolig.",
    datePublished: "2026-07-11",
    category: "marked",
  },
  {
    slug: "leiepriser-bergen",
    title: "Leiepriser i Bergen 2026: nivåer og yield",
    description:
      "Hva boliger leies ut for i Bergen: typiske nivåer per boligtype, studenteffekten og hvorfor yielden ofte er høyere enn i Oslo.",
    datePublished: "2026-07-11",
    category: "marked",
  },
  {
    slug: "hvor-i-norge-er-yield-hoyest",
    title: "Hvor i Norge er yield høyest? By mot distrikt",
    description:
      "Små byer gir ofte 5–7 % brutto yield der Oslo gir 3–4. Men høy yield har en grunn: slik veier du direkteavkastning mot verdistigning og risiko.",
    datePublished: "2026-07-11",
    category: "marked",
  },
];

export function getGuide(slug: string): GuideMeta {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Ukjent guide-slug: ${slug}`);
  return guide;
}

export function getGuidesInCategory(category: GuideCategory): GuideMeta[] {
  return GUIDES.filter((g) => g.category === category);
}

/**
 * Komplett Metadata for en guideside: tittel, beskrivelse, canonical og
 * OpenGraph av typen article med publiserings-/endringsdato.
 * OG-bildet plukkes automatisk opp fra opengraph-image.tsx i guidemappen.
 */
export function guidePageMetadata(slug: string): Metadata {
  const guide = getGuide(slug);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `/guide/${guide.slug}`,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified ?? guide.datePublished,
    },
  };
}

export function formatGuideDate(isoDate: string): string {
  return new Intl.DateTimeFormat("nb-NO", { dateStyle: "long" }).format(
    new Date(`${isoDate}T12:00:00Z`),
  );
}
