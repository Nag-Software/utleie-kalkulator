/**
 * Markedsleie-anslag ut fra by, antall rom og areal.
 * Nivåene følger SSBs leiemarkedsundersøkelse slik vi bruker dem i guidene
 * (Oslo/Bergen tidlig 2026), med nabo-byer i samme sjikt.
 */

export interface MarketRentEstimate {
  monthly: number;
  low: number;
  high: number;
  source: "listing" | "estimate";
  market: string;
  note: string;
}

interface RentBand {
  mid: number;
  low: number;
  high: number;
}

interface CityRentBand {
  byRooms: Record<number, RentBand>;
  typicalArea: Record<number, number>;
}

const DEFAULT_BAND: Record<number, RentBand> = {
  1: { mid: 8_000, low: 6_500, high: 10_000 },
  2: { mid: 12_000, low: 10_000, high: 14_500 },
  3: { mid: 15_000, low: 12_500, high: 18_000 },
  4: { mid: 18_000, low: 15_000, high: 22_000 },
};

const OSLO_BAND: Record<number, RentBand> = {
  1: { mid: 11_000, low: 9_000, high: 13_000 },
  2: { mid: 17_000, low: 15_000, high: 19_000 },
  3: { mid: 22_500, low: 19_000, high: 26_000 },
  4: { mid: 27_000, low: 23_000, high: 32_000 },
};

const BIG_CITY_BAND: Record<number, RentBand> = {
  1: { mid: 8_500, low: 7_000, high: 10_000 },
  2: { mid: 14_000, low: 12_000, high: 16_000 },
  3: { mid: 17_500, low: 15_000, high: 20_000 },
  4: { mid: 21_000, low: 18_000, high: 25_000 },
};

const TYPICAL_AREA: Record<number, number> = {
  1: 28,
  2: 52,
  3: 72,
  4: 95,
};

const MARKETS: Record<string, CityRentBand> = {
  Oslo: { byRooms: OSLO_BAND, typicalArea: TYPICAL_AREA },
  Bergen: { byRooms: BIG_CITY_BAND, typicalArea: TYPICAL_AREA },
  Trondheim: { byRooms: BIG_CITY_BAND, typicalArea: TYPICAL_AREA },
  Stavanger: { byRooms: BIG_CITY_BAND, typicalArea: TYPICAL_AREA },
  Kristiansand: { byRooms: DEFAULT_BAND, typicalArea: TYPICAL_AREA },
  Tromsø: { byRooms: BIG_CITY_BAND, typicalArea: TYPICAL_AREA },
  Drammen: { byRooms: DEFAULT_BAND, typicalArea: TYPICAL_AREA },
  Bærum: { byRooms: OSLO_BAND, typicalArea: TYPICAL_AREA },
};

function resolveRooms(rooms: number | null, bedrooms: number | null): number {
  if (rooms && rooms >= 1) return Math.min(4, Math.round(rooms));
  if (bedrooms != null && bedrooms >= 0) {
    return Math.min(4, Math.max(1, bedrooms + 1));
  }
  return 2;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function estimateMarketRent(options: {
  municipality: string | null;
  city: string | null;
  rooms: number | null;
  bedrooms: number | null;
  area: number | null;
  statedMonthlyRent: number | null;
}): MarketRentEstimate {
  if (
    options.statedMonthlyRent &&
    options.statedMonthlyRent >= 2_000 &&
    options.statedMonthlyRent <= 80_000
  ) {
    return {
      monthly: Math.round(options.statedMonthlyRent),
      low: Math.round(options.statedMonthlyRent * 0.95),
      high: Math.round(options.statedMonthlyRent * 1.05),
      source: "listing",
      market: options.municipality ?? options.city ?? "annonsen",
      note: "Leien er hentet fra annonsen (boligen ser ut til å være utleid). Kontroller at den er markedsmessig.",
    };
  }

  const marketName = options.municipality ?? options.city ?? "Norge";
  const table = options.municipality ? MARKETS[options.municipality] : undefined;
  const bandSource: Record<number, RentBand> = table?.byRooms ?? DEFAULT_BAND;
  const rooms = resolveRooms(options.rooms, options.bedrooms);
  const band = bandSource[rooms] ?? bandSource[2];
  const typical = (table?.typicalArea ?? TYPICAL_AREA)[rooms] ?? 52;

  let mid = band.mid;
  let low = band.low;
  let high = band.high;
  if (options.area && options.area > 8) {
    const factor = Math.min(1.35, Math.max(0.75, options.area / typical));
    mid *= factor;
    low *= factor;
    high *= factor;
  }

  const monthly = roundTo(mid, 250);
  const sourceLabel = table
    ? "SSB-leiemarked og våre byguider for 2026"
    : "nasjonalt sjikt (vi har ikke egen leietabell for dette stedet)";

  return {
    monthly,
    low: roundTo(low, 250),
    high: roundTo(high, 250),
    source: "estimate",
    market: marketName,
    note: `Anslag for ${rooms}-roms i ${marketName}, ${sourceLabel}. Sjekk aktive utleieannonser før du setter leien.`,
  };
}
