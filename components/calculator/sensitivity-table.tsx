"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SensitivityResult } from "@/lib/calc/engine";
import { formatNumber, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SensitivityTableProps {
  sensitivity: SensitivityResult;
  baseRate: number;
}

export function SensitivityTable({ sensitivity, baseRate }: SensitivityTableProps) {
  const rentLabels = ["Leie −10 %", "Dagens leie", "Leie +10 %"];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Kontantstrøm per måned etter skatt (år 1) ved endret rente og leie.
      </p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rente</TableHead>
              {rentLabels.map((label) => (
                <TableHead key={label} className="text-right">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensitivity.rateDeltas.map((delta, rateIdx) => {
              const isBase = delta === 0;
              return (
                <TableRow key={delta} className={cn(isBase && "bg-muted/50")}>
                  <TableCell className="font-medium">
                    {formatPct(Math.max(0, baseRate + delta), 2)}
                    {isBase ? (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        (dagens)
                      </span>
                    ) : null}
                  </TableCell>
                  {sensitivity.rentFactors.map((factor, rentIdx) => {
                    const value = sensitivity.cells[rateIdx][rentIdx];
                    return (
                      <TableCell
                        key={factor}
                        className={cn(
                          "text-right font-mono tabular-nums",
                          value >= 0
                            ? "bg-positive/10 text-positive"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {value >= 0 ? "+" : "−"}
                        {formatNumber(Math.abs(value))} kr
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
