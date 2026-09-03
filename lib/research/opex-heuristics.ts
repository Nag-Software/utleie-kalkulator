/**
 * Driftsantakelser ut fra byggeår, boligtype, areal og energimerke.
 * Strømanslaget er til informasjon (leietaker betaler som regel selv) og
 * fylles ikke inn i kalkulatoren.
 */

export interface InsuranceEstimate {
  yearly: number;
  note: string;
}

export interface MaintenanceEstimate {
  pct: number;
  note: string;
}

export interface EnergyNote {
  label: string | null;
  letter: string | null;
  electricityYearlyEstimate: number | null;
  note: string | null;
}

function isHouse(propertyType: string | null): boolean {
  return /enebolig|rekkehus|tomanns|småbruk|hytte/i.test(propertyType ?? "");
}

export function estimateInsurance(options: {
  propertyType: string | null;
  area: number | null;
}): InsuranceEstimate {
  const area = options.area && options.area > 0 ? options.area : 60;
  const yearly = isHouse(options.propertyType)
    ? Math.round((4_500 + area * 55) / 500) * 500
    : Math.round((2_000 + area * 30) / 500) * 500;
  const capped = Math.min(18_000, Math.max(2_000, yearly));
  return {
    yearly: capped,
    note: isHouse(options.propertyType)
      ? `Anslag for husforsikring ut fra ${area} m². Sameie/borettslag dekker ofte bygningsforsikringen – da kan du sette lavere.`
      : `Anslag for innboforsikring og eieransvar ut fra ${area} m². Bygningsforsikring ligger ofte i felleskostnadene.`,
  };
}

export function estimateMaintenancePct(buildYear: number | null): MaintenanceEstimate {
  if (buildYear == null || buildYear < 1800 || buildYear > 2030) {
    return {
      pct: 5,
      note: "Standard 5 % av leien til vedlikehold. Juster opp for eldre bygningskropp eller slitt standard.",
    };
  }
  if (buildYear < 1960) {
    return {
      pct: 8,
      note: `Byggeår ${buildYear}: eldre bygningskropp, vi setter 8 % av leien til vedlikehold.`,
    };
  }
  if (buildYear < 1990) {
    return {
      pct: 6,
      note: `Byggeår ${buildYear}: vi setter 6 % av leien til vedlikehold.`,
    };
  }
  if (buildYear < 2010) {
    return {
      pct: 5,
      note: `Byggeår ${buildYear}: standard 5 % av leien til vedlikehold.`,
    };
  }
  return {
    pct: 4,
    note: `Byggeår ${buildYear}: nyere bolig, vi setter 4 % av leien til vedlikehold.`,
  };
}

const KWH_PER_M2: Record<string, number> = {
  A: 70,
  B: 90,
  C: 120,
  D: 150,
  E: 180,
  F: 210,
  G: 250,
};

const KR_PER_KWH = 1.8;

export function describeEnergy(options: {
  energyLabel: string | null;
  area: number | null;
}): EnergyNote {
  if (!options.energyLabel) {
    return { label: null, letter: null, electricityYearlyEstimate: null, note: null };
  }
  const letterMatch = options.energyLabel.match(/\b([A-G])\b/i);
  const letter = letterMatch ? letterMatch[1].toUpperCase() : null;
  const area = options.area && options.area > 0 ? options.area : null;
  const kwh = letter ? KWH_PER_M2[letter] : null;
  const electricityYearlyEstimate =
    kwh && area ? Math.round((area * kwh * KR_PER_KWH) / 500) * 500 : null;

  const note = electricityYearlyEstimate
    ? `Energimerke ${letter}: typisk strømkostnad rundt ${electricityYearlyEstimate.toLocaleString("nb-NO")} kr/år for ${area} m² (leietaker betaler som regel selv, så beløpet er ikke lagt inn i kalkulatoren).`
    : `Energimerke ${options.energyLabel}. Dårlig merke kan gi lavere leie og høyere strøm for leietaker.`;

  return {
    label: options.energyLabel,
    letter,
    electricityYearlyEstimate,
    note,
  };
}
