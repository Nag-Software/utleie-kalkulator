import { Smartphone } from "lucide-react";

/**
 * Ikonet på Vipps-knappene.
 *
 * Med vilje IKKE en hjemmetegnet kopi av Vipps-logoen: logoen og den oransje
 * «Vipps»-knappen er varemerkebeskyttet, og Vipps MobilePay har egne
 * retningslinjer for hvordan de skal brukes. Navnet «Vipps» i knappeteksten
 * er lovlig, beskrivende bruk.
 *
 * Skal de offisielle knappene inn, er dette det ene stedet å bytte:
 * hent SVG-ene fra Vipps' merkevareportal og render dem her.
 * https://developer.vippsmobilepay.com/docs/knowledge-base/design-guidelines/
 */
export function VippsMark(props: React.ComponentProps<typeof Smartphone>) {
  return <Smartphone aria-hidden {...props} />;
}
