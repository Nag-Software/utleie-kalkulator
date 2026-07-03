"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatNumber, parseDecimal, parseNOK } from "@/lib/format";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  suffix?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function FieldShell({ id, label, hint, children, action }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-[13px]">
          {label}
        </Label>
        {action}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

interface MoneyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  sliderMax?: number;
  sliderStep?: number;
  hint?: string;
  action?: React.ReactNode;
}

/** Kronebeløp: input med nb-NO-formatering ved blur + valgfri slider. */
export function MoneyField({
  label,
  value,
  onChange,
  sliderMax,
  sliderStep = 1000,
  hint,
  action,
}: MoneyFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <FieldShell id={id} label={label} hint={hint} action={action}>
      <div className="relative">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="pr-9 font-mono tabular-nums"
          value={draft ?? formatNumber(value)}
          onFocus={(e) => {
            setDraft(value === 0 ? "" : String(value));
            requestAnimationFrame(() => e.target.select());
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(parseNOK(e.target.value));
          }}
          onBlur={() => setDraft(null)}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          kr
        </span>
      </div>
      {sliderMax ? (
        <Slider
          aria-label={label}
          value={[Math.min(value, sliderMax)]}
          max={sliderMax}
          step={sliderStep}
          onValueChange={([v]) => onChange(v)}
          className="pt-1"
        />
      ) : null}
    </FieldShell>
  );
}

interface NumberSliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  suffix: string;
  decimals?: number;
  hint?: string;
}

/** Prosent- og årstall: input + slider. */
export function NumberSliderField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 0.1,
  suffix,
  decimals = 1,
  hint,
}: NumberSliderFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const displayValue =
    draft ??
    value.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });

  return (
    <FieldShell id={id} label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <div className="relative w-28 shrink-0">
          <Input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className="pr-8 font-mono tabular-nums"
            value={displayValue}
            onFocus={(e) => {
              setDraft(String(value).replace(".", ","));
              requestAnimationFrame(() => e.target.select());
            }}
            onChange={(e) => {
              setDraft(e.target.value);
              onChange(clamp(parseDecimal(e.target.value)));
            }}
            onBlur={() => setDraft(null)}
          />
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-muted-foreground">
            {suffix}
          </span>
        </div>
        <Slider
          aria-label={label}
          value={[clamp(value)]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(Math.round(v * 100) / 100)}
        />
      </div>
    </FieldShell>
  );
}

interface SegmentedFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}

/** To-valgs bryter (eieform, lånetype). */
export function SegmentedField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: SegmentedFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              value === option.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </FieldShell>
  );
}
