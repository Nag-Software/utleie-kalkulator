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
    question: "Hvor mye egenkapital trenger jeg for å kjøpe utleiebolig?",
    answer:
      "Utlånsforskriften krever minst 10 % egenkapital ved kjøp av bolig, også sekundærbolig. I praksis vurderer banken hele økonomien din: samlet gjeld kan ikke overstige fem ganger brutto inntekt, og du må tåle en renteøkning på 3 prosentpoeng. Dokumenterte leieinntekter kan telle positivt i vurderingen. Bruk kalkulatoren til å se hvor høy rente økonomien tåler før du snakker med banken.",
  },
  {
    question: "Hvordan regner jeg ut om utleie lønner seg?",
    answer:
      "Sett opp alle inntekter og kostnader: leieinntekter minus lånekostnader, felleskostnader, kommunale avgifter, forsikring, vedlikehold, ledighet og skatt. Er kontantstrømmen positiv, betaler boligen for seg selv – i tillegg kommer nedbetaling av lån og eventuell verdistigning. Utleiekalkulatoren gjør hele regnestykket automatisk og viser kontantstrøm, yield, cash-on-cash og break-even.",
  },
  {
    question: "Kan jeg leie ut via Airbnb i borettslag eller sameie?",
    answer:
      "Ja, men med grenser: i borettslag kan du korttidsutleie boligen i inntil 30 døgn per år uten styrets samtykke, og i eierseksjonssameier er grensen 90 døgn (vedtektene kan sette 60–120). Skattemessig er korttidsutleie av egen bolig skattefri opp til 10 000 kr i året; av det overskytende regnes 85 % som skattepliktig inntekt med 22 % skatt.",
  },
  {
    question: "Hva koster utleiekalkulatoren?",
    answer:
      "Kalkulatoren er gratis når du legger inn tallene selv, uten konto og uten begrensninger. Vil du hente tallene automatisk fra FINN, koster et klippekort 49 kr for 20 annonser og er gyldig i 12 måneder. Feiler hentingen, brukes det ikke et klipp. Samme annonse kan åpnes igjen uten nytt klipp.",
  },
  {
    question: "Lagres tallene mine?",
    answer:
      "Selve beregningen lagres ikke i en egen database; tallene legges i lenken du kan dele. Kjøper du et klippekort, lagres saldoen sammen med kundereferansen hos betalingsleverandøren. En nødvendig informasjonskapsel knytter kortet til nettleseren din, eller til Vipps-innloggingen hvis du logger inn.",
  },
];
