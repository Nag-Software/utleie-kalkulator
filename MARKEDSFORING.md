# Markedsføringsplan: utleie-kalkulator.no

Mål: rangere øverst på Google for «utleie kalkulator» / «utleiekalkulator» og
long-tail-søk rundt utleiebolig — uten annonser. All trafikk skal komme
organisk. Planen er passiv: mest engangsjobber, deretter en lett månedsrytme.

## Gjør én gang nå (ca. 45 min)

1. **Google Search Console** (viktigst av alt)
   - Gå til <https://search.google.com/search-console> → «Legg til område» →
     domene `utleie-kalkulator.no` → verifiser med DNS TXT-record hos
     registraren (alternativ: HTML-tag → lim verdien inn i Vercel-env
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, støtten ligger i koden).
   - Send inn sitemap: `https://utleie-kalkulator.no/sitemap.xml`.
   - Be om indeksering av forsiden + alle guider manuelt («URL-inspeksjon» →
     «Be om indeksering») — kutter dager/uker av ventetiden for et nytt domene.
2. **Bing Webmaster Tools** — importer fra Search Console med to klikk.
   Gir Bing/DuckDuckGo/Copilot-trafikk gratis, og koster ingenting.
3. **Sjekk at kun én versjon av siten finnes**: `www.` og
   `utleie-kalkulator.vercel.app` skal 301-e til `https://utleie-kalkulator.no`
   (ligger i `next.config.ts` — verifiser etter deploy med
   `curl -I https://utleie-kalkulator.vercel.app`).

## Lenker (det som faktisk avgjør rangering nr. 1)

Et nytt domene rangerer på innhold alene ved lav konkurranse, men topplassering
på hovedordet krever noen reelle lenker. Prioritert etter innsats/effekt:

1. **Egne siter**: lenk fra andre Nag Software-prosjekter (f.eks. footer
   «Flere verktøy») og fra personlig LinkedIn-profil/GitHub-profil.
2. **Svar der spørsmålet stilles** (10 min når det passer, aldri spam):
   r/norge, r/oslo og personlig økonomi-tråder på Reddit, diskusjon.no,
   Kvinneguiden økonomi. Svar ordentlig på spørsmål om utleie/lønnsomhet og
   lenk til kalkulatoren eller riktig guide når den faktisk svarer på
   spørsmålet. 5–10 gode svar gir både lenker, trafikk og brand-søk.
3. **Facebook-grupper for utleiere** («Utleie av bolig», investorgrupper):
   del kalkulatoren én gang som verktøytips, svar på spørsmål ellers.
4. **Én e-post til hver av**: Huseierne, Boligmentoren og et par
   boligøkonomi-bloggere — «gratis kalkulator uten registrering, fritt frem å
   lenke/omtale». Én lenke fra et slikt nettsted er verdt mer enn alt annet
   på denne listen.
5. **Journalist-vinkelen** (valgfritt, høyest oppside): når renten endres
   skriver alle om boligmarkedet — tilby E24/DN/Nettavisen en konkret
   utregning («så mye endrer kontantstrømmen seg for en typisk utleiebolig»).
   Verktøy som kan regne får ofte omtale + lenke.

## Månedsrytme (2–3 timer/mnd, ellers passivt)

1. **Én ny guide per måned** mot long-tail-søk. Neste emner, i prioritert
   rekkefølge (velg fra søkeord folk faktisk bruker):
   - «Depositum eller depositumsgaranti — hva bør utleier kreve?»
   - «Korttidsutleie og Airbnb: regler og skatt»
   - «Utleiemegler eller leie ut selv? Hva koster forvaltning»
   - «Førstegangsutleier: sjekkliste fra visning til innflytting»
   - «Fellesgjeld og felleskostnader: slik leser du en FINN-annonse»
   - «Serielån eller annuitetslån på utleiebolig?»
   - «Formuesskatt på sekundærbolig»
   - «Leie ut møblert eller umøblert?»
   - «Tomgang: hva koster en måned uten leietaker?»
   - «Salg av utleiebolig: skatt og botid»
   Hver guide: legg til i `lib/guides.ts`, lenk til kalkulatoren og 2–3 andre
   guider, oppgi kilder (Skatteetaten/Lovdata/SSB), oppdater `llms.txt`.
2. **15 min i Search Console**: se hvilke søkeord som gir visninger uten
   klikk (juster titler/beskrivelser), og hvilke sider som ligger på side 2
   (styrk med interne lenker og mer innhold).
3. **Årlig**: oppdater satser/årstall i guidene og «(2026)» i titler —
   ferskhet er et rangeringssignal for år-spesifikke søk.

## Hvorfor dette virker uten annonser

- **Exact match-domene + dedikert verktøy**: Google foretrekker en side som
  *er* svaret på «utleie kalkulator» fremfor en artikkel om temaet.
- **Long-tail først**: guidene fanger hundrevis av små søk («hva kan jeg leie
  ut for», «egenkapital utleiebolig») med lav konkurranse. De bygger
  autoritet som løfter forsiden på hovedordet.
- **AI-søk er gratistrafikk nr. 2**: `llms.txt`, åpen robots.txt og
  strukturert data gjør at ChatGPT/Perplexity/Google AI Overviews kan sitere
  og anbefale kalkulatoren.
- **Ingen løpende kostnad**: alt over er engangsarbeid eller en lett
  månedsrutine.

## Forventninger

- Uke 1–2: indeksert (gitt Search Console-innsending).
- Måned 1–3: topp 10 på long-tail-søkene fra guidene; hovedordet klatrer.
- Måned 3–6: realistisk topp 3–5 på «utleiekalkulator» med 3–5 gode lenker;
  nr. 1 avhenger av konkurrentene (etablerte bank-/mediesider) og lenkene.
- Følg utviklingen i Search Console — ikke i manuelle søk (personalisering).
