"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CalcResult } from "@/lib/calc/engine";
import { formatNOK, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

function money(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? "−" : ""}${formatNumber(Math.abs(rounded))}`;
}

export function DetailsTable({ result }: { result: CalcResult }) {
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Totalpris (inkl. fellesgjeld)</dt>
          <dd className="font-mono tabular-nums">{formatNOK(result.totalPropertyCost)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Totalt prosjekt (m/omkostninger)</dt>
          <dd className="font-mono tabular-nums">{formatNOK(result.totalProjectCost)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Lånebeløp</dt>
          <dd className="font-mono tabular-nums">{formatNOK(result.loanAmount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Terminbeløp første måned</dt>
          <dd className="font-mono tabular-nums">{formatNOK(result.monthlyPayment)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Driftskostnader per måned</dt>
          <dd className="font-mono tabular-nums">{formatNOK(result.monthlyOpex)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Belåningsgrad</dt>
          <dd className="font-mono tabular-nums">
            {result.ltvPct !== null ? `${result.ltvPct.toFixed(1).replace(".", ",")} %` : "–"}
          </dd>
        </div>
      </dl>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>År</TableHead>
              <TableHead className="text-right">Leie (effektiv)</TableHead>
              <TableHead className="text-right">Drift</TableHead>
              <TableHead className="text-right">Renter</TableHead>
              <TableHead className="text-right">Avdrag</TableHead>
              <TableHead className="text-right">Skatt</TableHead>
              <TableHead className="text-right">Kontantstrøm</TableHead>
              <TableHead className="text-right">Restgjeld</TableHead>
              <TableHead className="text-right">Boligverdi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.years.map((y) => (
              <TableRow key={y.year}>
                <TableCell className="font-medium">{y.year}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.effectiveRent)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.opex)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.interestPaid)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.principalPaid)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.tax)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-medium tabular-nums",
                    y.cashflowAfterTax >= 0 ? "text-positive" : "text-destructive",
                  )}
                >
                  {money(y.cashflowAfterTax)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.loanBalance)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {money(y.propertyValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Alle beløp i kroner. Negativ skatt = fradragsfordel som forutsetter annen
        alminnelig inntekt. Verdistigning og salgskostnader er ikke del av
        kontantstrømmen.
      </p>
    </div>
  );
}
