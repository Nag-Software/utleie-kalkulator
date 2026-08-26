"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  cumulativeCashflow: {
    label: "Akkumulert kontantstrøm",
    color: "var(--chart-1)",
  },
  equityValue: {
    label: "Egenkapitalverdi",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ProjectionChart({ years }: { years: YearRow[] }) {
  const data = years.map((y) => ({
    year: `År ${y.year}`,
    cumulativeCashflow: Math.round(y.cumulativeCashflow),
    equityValue: Math.round(y.equityValue),
  }));

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
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
                  <span className="font-medium tabular-nums">
                    {formatNOK(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="equityValue"
          type="monotone"
          fill="var(--color-equityValue)"
          fillOpacity={0.15}
          stroke="var(--color-equityValue)"
          strokeWidth={2}
        />
        <Area
          dataKey="cumulativeCashflow"
          type="monotone"
          fill="var(--color-cumulativeCashflow)"
          fillOpacity={0.2}
          stroke="var(--color-cumulativeCashflow)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
