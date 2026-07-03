"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { YearRow } from "@/lib/calc/engine";
import { formatCompact, formatNOK } from "@/lib/format";

const chartConfig = {
  interestPaid: {
    label: "Renter",
    color: "var(--chart-4)",
  },
  principalPaid: {
    label: "Avdrag",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AmortizationChart({ years }: { years: YearRow[] }) {
  const data = years.map((y) => ({
    year: `År ${y.year}`,
    interestPaid: Math.round(y.interestPaid),
    principalPaid: Math.round(y.principalPaid),
  }));

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={6} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => formatCompact(v)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="size-2 rounded-[2px]"
                      style={{ background: item.color }}
                    />
                    {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatNOK(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="interestPaid" stackId="a" fill="var(--color-interestPaid)" />
        <Bar
          dataKey="principalPaid"
          stackId="a"
          fill="var(--color-principalPaid)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
