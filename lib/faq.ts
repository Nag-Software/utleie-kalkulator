export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Hva er en god yield på utleiebolig?",
    answer:
      "Brutto yield (årsleie delt på kjøpesum) ligger typisk på 3–4 % i Oslo og 5–7 % eller høyere i mindre byer og studentbyer. Netto yield, som også trekker fra felleskostnader, vedlikehold og andre driftskostnader, gir et mer reelt bilde og bør vurderes opp mot risikofri rente. Kalkulatoren regner ut begge automatisk.",
  },
  {
    question: "Hvordan beskattes utleieinntekter i 2026?",
    answer:
      "Skattepliktig utleie beskattes som kapitalinntekt med 22 % av netto resultat, altså leieinntekter minus fradragsberettigede kostnader som felleskostnader, kommunale avgifter, forsikring, vedlikehold og gjeldsrenter. Går utleien med underskudd, kan fradraget redusere annen skatt. Kalkulatoren håndterer begge deler.",
  },
  {
    question: "Når er utleie skattefritt?",
    answer:
      "Leier du ut mindre enn halvparten av boligen du selv bor i, regnet etter utleieverdi, er leieinntektene skattefrie. Ved korttidsutleie av egen bolig (under 30 dager) er inntekter opp til 10 000 kr i året skattefrie, deretter regnes 85 % av det overskytende som inntekt. Utleie av sekundærbolig er alltid skattepliktig. Sett skattesatsen til 0 i kalkulatoren for skattefri utleie.",
  },
  {
    question: "Hva er forskjellen på brutto og netto yield?",
    answer:
      "Brutto yield = årsleie / totalpris. Netto yield = netto driftsresultat (leie minus ledighet og alle driftskostnader) / total investering inkludert omkostninger og oppussing. Netto yield er alltid lavere og gir det ærligste bildet av den løpende avkastningen.",
  },
  {
    question: "Hva er dokumentavgift, og hvem betaler den?",
    answer:
      "Dokumentavgiften er 2,5 % av kjøpesummen og betales av kjøper ved overtakelse av selveierbolig. Andelsleiligheter i borettslag og aksjeleiligheter er fritatt – der betaler du kun et mindre eierskiftegebyr. Kalkulatoren beregner riktig omkostning automatisk ut fra eieform.",
  },
  {
    question: "Hva betyr negativ kontantstrøm?",
    answer:
      "Negativ kontantstrøm betyr at leieinntektene ikke dekker lånebetjening, driftskostnader og skatt – du må skyte inn penger hver måned. Investeringen kan likevel bli lønnsom totalt gjennom nedbetaling av lån og verdistigning, men du bærer risikoen og må tåle den månedlige belastningen. Kalkulatoren viser begge perspektivene.",
  },
  {
    question: "Hva koster utleiekalkulatoren?",
    answer:
      "Kalkulatoren er gratis når du legger inn tallene selv, uten konto og uten begrensninger. Vil du hente tallene automatisk fra en FINN-annonse og få en objektiv KI-vurdering med sannsynlighet for lønnsomhet, koster det 9,90 kr per beregning. Feiler hentingen, refunderes beløpet automatisk.",
  },
  {
    question: "Lagres tallene mine?",
    answer:
      "Nei. Kalkulatoren kjører i nettleseren din, og deling skjer ved at tallene legges i lenken – vi har ingen database. Kjøper du en FINN-beregning, lagres boligtallene og KI-vurderingen sammen med betalingen hos Stripe, og lenken din er nøkkelen til beregningen.",
  },
];
