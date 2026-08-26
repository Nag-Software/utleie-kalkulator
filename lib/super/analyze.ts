import "server-only";
import * as cheerio from "cheerio";
import { buildAmortizationSchedule, resolveTransactionCosts } from "@/lib/calc/engine";
import { DEFAULT_INPUT } from "@/lib/calc/schema";
import { parseFinnNumber } from "@/lib/finn/numbers";
import { extractFinnkode } from "@/lib/finn/finnkode";
import {
  SUPER_DEFAULTS,
  type SuperAnalysis,
  type SuperAssumptions,
  type SuperSearchListing,
} from "./types";

const ALLOWED_HOSTS = new Set(["finn.no", "www.finn.no", "m.finn.no"]);
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const DEFAULT_TAX_RATE = 22;
const DEFAULT_VACANCY_RATE = 3;
const DEFAULT_MAINTENANCE_PCT = 3;
const DEFAULT_MANAGEMENT_PCT = 0;
const DEFAULT_INSURANCE_YEARLY = 3_000;
const DEFAULT_MUNICIPAL_FEES_YEARLY = 9_000;
const DEFAULT_RENT_PER_SQM = 290;
const DEFAULT_MAX_PAGES = 20;
const FETCH_RETRY_COUNT = 3;
const FETCH_RETRY_DELAY_MS = 500;

export function normalizeFinnSearchUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (url.pathname !== "/realestate/homes/search.html") return null;
    return url;
  } catch {
    return null;
  }
}

async function fetchHtml(url: URL): Promise<string> {
  for (let attempt = 1; attempt <= FETCH_RETRY_COUNT; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "nb-NO,nb;q=0.9,en;q=0.5",
      },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
      cache: "no-store",
    });

    if (response.ok) {
      return response.text();
    }

    if (response.status >= 500 && attempt < FETCH_RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, FETCH_RETRY_DELAY_MS * attempt));
      continue;
    }

    return response.text();
  }

  return "";
}

function extractPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function extractMoney(text: string | null | undefined): number | null {
  return parseFinnNumber(text ?? null);
}

function extractAskingPrice(text: string): number | null {
  const lowered = text.toLowerCase();
  const totalIndex = lowered.indexOf("totalpris");
  const segment = totalIndex >= 0 ? text.slice(0, totalIndex) : text;
  const matches = [...segment.matchAll(/\d[\d\s  ]*\s*kr/gi)];
  if (matches.length === 0) return null;
  return parseFinnNumber(matches[matches.length - 1][0]);
}

type CheerioNode = ReturnType<cheerio.CheerioAPI>[number];
type CheerioSelection = cheerio.Cheerio<CheerioNode>;

function getCardText(link: CheerioSelection): string {
  const selectors = ["article", "li", "section", "div"];
  for (let depth = 0; depth < 8; depth += 1) {
    const ancestor = link.parent().parents().eq(depth);
    if (!ancestor.length) break;
    const text = ancestor.text().replace(/\s+/g, " ").trim();
    if (text.length < 80) continue;
    const signals = ["kr", "m²", "soverom", "totalpris", "fellesutg", "selveier", "andel"];
    const signalCount = signals.reduce((count, signal) => count + (text.toLowerCase().includes(signal) ? 1 : 0), 0);
    if (signalCount >= 2) return text;
  }

  for (const selector of selectors) {
    const candidate = link.closest(selector);
    if (!candidate.length) continue;
    const text = candidate.text().replace(/\s+/g, " ").trim();
    if (text.length > 80) return text;
  }

  return link.parent().text().replace(/\s+/g, " ").trim();
}

function parseSearchListing(
  $: cheerio.CheerioAPI,
  element: CheerioNode,
  page: number,
): SuperSearchListing | null {
  const link = $(element);
  const href = link.attr("href") ?? "";
  const finnkode = extractFinnkode(href);
  if (!finnkode) return null;

  const rawText = getCardText(link);
  const root = link.closest("article").length
    ? link.closest("article")
    : link.closest("li").length
      ? link.closest("li")
      : link.closest("section").length
        ? link.closest("section")
        : link.parent();
  const title =
    link.text().replace(/\s+/g, " ").trim() ||
    root.find("h2").first().text().replace(/\s+/g, " ").trim() ||
    root.find("h3").first().text().replace(/\s+/g, " ").trim() ||
    null;

  const imageUrl =
    root.find("img").first().attr("src")?.trim() ||
    root.find("img").first().attr("data-src")?.trim() ||
    null;

  const askingPrice = extractAskingPrice(rawText);
  const totalPrice = extractPattern(rawText, [
    /totalpris\s*:?\s*([\d\s  \-]+)\s*kr/i,
  ]);
  const hoaFeesMonthly = extractPattern(rawText, [
    /fellesutg\.?\s*:?\s*([\d\s  \-]+)\s*kr/i,
    /felleskost(?:nader)?(?:\/mnd)?\.?\s*:?\s*([\d\s  \-]+)\s*kr/i,
  ]);
  const ownershipType = extractPattern(rawText, [
    /\b(selveier|andel|aksje|obligasjon|annet)\b/i,
  ]);
  const propertyType = extractPattern(rawText, [
    /\b(leilighet|enebolig|rekkehus|tomannsbolig|gårdsbruk\/småbruk|garasje\/parkering|hytte|andre)\b/i,
  ]);
  const bedrooms = extractPattern(rawText, [/\b(\d+)\s*soverom\b/i]);
  const area = extractPattern(rawText, [/\b(\d[\d\s  ]*)\s*m²\b/i]);

  const resolvedPurchasePrice = askingPrice ?? extractMoney(totalPrice);
  if (resolvedPurchasePrice === null) return null;

  return {
    finnkode,
    url: `https://www.finn.no/realestate/homes/ad.html?finnkode=${finnkode}`,
    title,
    imageUrl,
    askingPrice: resolvedPurchasePrice,
    totalPrice: extractMoney(totalPrice),
    hoaFeesMonthly: extractMoney(hoaFeesMonthly),
    ownershipType,
    propertyType,
    bedrooms: bedrooms ? Number.parseInt(bedrooms, 10) : null,
    area: area ? parseFinnNumber(area) : null,
    rawText,
    page,
  };
}

function parseSearchListingFromText(
  finnkode: string,
  text: string,
  page: number,
): SuperSearchListing | null {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (!normalizedText) return null;

  const titleMatch = normalizedText.match(
    /^(.{20,180}?)\s+(?:\d[\d\s  ]*\s*m²|\d[\d\s  ]*\s*kr|totalpris|fellesutg\.?)/i,
  );
  const title = titleMatch?.[1]?.trim() ?? null;

  const askingPrice = extractAskingPrice(normalizedText);
  const totalPrice = extractPattern(normalizedText, [
    /totalpris\s*:?\s*([\d\s  \-]+)\s*kr/i,
  ]);
  const hoaFeesMonthly = extractPattern(normalizedText, [
    /fellesutg\.?\s*:?\s*([\d\s  \-]+)\s*kr/i,
    /felleskost(?:nader)?(?:\/mnd)?\.?\s*:?\s*([\d\s  \-]+)\s*kr/i,
  ]);
  const ownershipType = extractPattern(normalizedText, [
    /\b(selveier|andel|aksje|obligasjon|annet)\b/i,
  ]);
  const propertyType = extractPattern(normalizedText, [
    /\b(leilighet|enebolig|rekkehus|tomannsbolig|gårdsbruk\/småbruk|garasje\/parkering|hytte|andre)\b/i,
  ]);
  const bedrooms = extractPattern(normalizedText, [/\b(\d+)\s*soverom\b/i]);
  const area = extractPattern(normalizedText, [/\b(\d[\d\s  ]*)\s*m²\b/i]);

  const resolvedPurchasePrice = askingPrice ?? extractMoney(totalPrice);
  if (resolvedPurchasePrice === null) return null;

  return {
    finnkode,
    url: `https://www.finn.no/realestate/homes/ad.html?finnkode=${finnkode}`,
    title,
    imageUrl: null,
    askingPrice: resolvedPurchasePrice,
    totalPrice: extractMoney(totalPrice),
    hoaFeesMonthly: extractMoney(hoaFeesMonthly),
    ownershipType,
    propertyType,
    bedrooms: bedrooms ? Number.parseInt(bedrooms, 10) : null,
    area: area ? parseFinnNumber(area) : null,
    rawText: normalizedText,
    page,
  };
}

function estimateMonthlyRent(listing: SuperSearchListing): number {
  const type = (listing.propertyType ?? "").toLowerCase();
  const bedroomPremium = Math.max(0, (listing.bedrooms ?? 0) - 1) * 1_100;
  const sizeBasedRent = listing.area ? listing.area * DEFAULT_RENT_PER_SQM : null;
  const fallbackBaseByType = type.includes("enebolig")
    ? 19_500
    : type.includes("rekkehus")
      ? 17_500
      : type.includes("tomannsbolig")
        ? 16_500
        : type.includes("hytte")
          ? 13_500
          : type.includes("leilighet")
            ? 14_500
            : 15_000;
      const estimate = Math.max(
        fallbackBaseByType,
        sizeBasedRent ?? 0,
      ) + bedroomPremium;
      return Math.max(0, Math.round(estimate));
}

function analyzeListing(
  listing: SuperSearchListing,
  assumptions: SuperAssumptions,
): SuperAnalysis {
  const resolvedOwnershipType: "selveier" | "andel" = /andel|aksje|obligasjon/i.test(
    listing.ownershipType ?? "",
  )
    ? "andel"
    : "selveier";

  const resolvedPurchasePrice = listing.askingPrice ?? 0;
  const transactionCosts = resolveTransactionCosts({
    ...DEFAULT_INPUT,
    ownershipType: resolvedOwnershipType,
    purchasePrice: resolvedPurchasePrice,
    transactionCosts: null,
    sharedDebt: 0,
    renovationCost: assumptions.renovationCost,
    otherPurchaseCosts: assumptions.otherPurchaseCosts,
  });

  const sharedDebt = Math.max(
    0,
    (listing.totalPrice ?? resolvedPurchasePrice) - resolvedPurchasePrice - transactionCosts,
  );
  const totalPropertyCost = resolvedPurchasePrice + sharedDebt;
  const totalProjectCost =
    resolvedPurchasePrice + transactionCosts + assumptions.renovationCost + assumptions.otherPurchaseCosts;
  const equity = Math.max(0, Math.round((totalProjectCost * assumptions.equityPct) / 100));
  const loanAmount = Math.max(0, totalProjectCost - equity);
  const schedule = buildAmortizationSchedule(
    loanAmount,
    assumptions.interestRate,
    assumptions.loanTermYears,
    assumptions.interestOnlyYears,
    assumptions.loanType,
  );
  const firstYear = schedule.slice(0, 12);
  const debtService = firstYear.reduce((sum, month) => sum + month.payment, 0);
  const interestPaid = firstYear.reduce((sum, month) => sum + month.interest, 0);

  const fixedOpexMonthly =
    (listing.hoaFeesMonthly ?? 0) +
    DEFAULT_MUNICIPAL_FEES_YEARLY / 12 +
    DEFAULT_INSURANCE_YEARLY / 12 +
    0;
  const variableOpexPct =
    (DEFAULT_MAINTENANCE_PCT + DEFAULT_MANAGEMENT_PCT) / 100;
  const estimatedMonthlyRent = estimateMonthlyRent(listing);

  const annualGrossRent = estimatedMonthlyRent * 12;
  const annualEffectiveRent = annualGrossRent * (1 - DEFAULT_VACANCY_RATE / 100);
  const annualFixedOpex = fixedOpexMonthly * 12;
  const annualVariableOpex = annualGrossRent * variableOpexPct;
  const annualOpex = annualFixedOpex + annualVariableOpex;
  const noi = annualEffectiveRent - annualOpex;
  const cashflowBeforeTax = noi - debtService;
  const taxableIncome = annualEffectiveRent - annualOpex - interestPaid;
  const tax = (DEFAULT_TAX_RATE / 100) * taxableIncome;
  const cashflowAfterTax = cashflowBeforeTax - tax;

  const grossYieldPct =
    totalPropertyCost > 0 ? (annualGrossRent / totalPropertyCost) * 100 : null;
  const netYieldPct = totalProjectCost > 0 ? (noi / totalProjectCost) * 100 : null;
  const cashOnCashPct = equity > 0 ? (cashflowAfterTax / equity) * 100 : null;

  const taxRate = DEFAULT_TAX_RATE / 100;
  const rentCoefficient =
    (1 - taxRate) *
    (12 * (1 - DEFAULT_VACANCY_RATE / 100) - 12 * variableOpexPct);
  const rentIntercept =
    -(1 - taxRate) * annualFixedOpex - debtService + taxRate * interestPaid;
  const breakEvenRent = rentCoefficient > 0 ? -rentIntercept / rentCoefficient : null;

  const score =
    cashflowAfterTax / 12 +
    (cashOnCashPct ?? 0) * 25 +
    (grossYieldPct ?? 0) * 5 +
    (breakEvenRent ? Math.max(0, estimatedMonthlyRent - breakEvenRent) / 10 : 0);

  const warnings: string[] = [];
  if (listing.area === null) warnings.push("Mangler størrelse på treffet. Leie er derfor estimert fra fallback.");
  if (listing.bedrooms === null) warnings.push("Mangler antall soverom. Premium per soverom ble ikke brukt.");
  if (listing.totalPrice === null) warnings.push("Mangler totalpris. Fellesgjeld er satt til 0.");
  if (listing.hoaFeesMonthly === null) warnings.push("Mangler felleskostnader. Bruker 0 kr/mnd i modellen.");
  if (sharedDebt === 0 && listing.totalPrice !== null && listing.totalPrice < resolvedPurchasePrice) {
    warnings.push("Totalpris var lavere enn prisantydning. Modellen satte fellesgjeld til 0.");
  }

  return {
    ...listing,
    resolvedOwnershipType,
    estimatedMonthlyRent,
    transactionCosts,
    sharedDebt,
    totalPropertyCost,
    totalProjectCost,
    equity,
    loanAmount,
    monthlyCashflowBeforeTax: cashflowBeforeTax / 12,
    monthlyCashflowAfterTax: cashflowAfterTax / 12,
    grossYieldPct,
    netYieldPct,
    cashOnCashPct,
    breakEvenRent,
    score,
    warnings,
  };
}

function collectSearchListings(html: string, page: number): SuperSearchListing[] {
  const $ = cheerio.load(html);
  const unique = new Map<string, SuperSearchListing>();

  $("a[href*='finnkode=']").each((_, element) => {
    const listing = parseSearchListing($, element, page);
    if (!listing) return;
    const existing = unique.get(listing.finnkode);
    if (!existing || listing.rawText.length > existing.rawText.length) {
      unique.set(listing.finnkode, listing);
    }
  });

  const finnkodePattern = /finnkode[^0-9]{0,20}(\d{8,10})/gi;
  for (const match of html.matchAll(finnkodePattern)) {
    const finnkode = match[1];
    if (unique.has(finnkode)) continue;

    const start = Math.max(0, (match.index ?? 0) - 2_000);
    const end = Math.min(html.length, (match.index ?? 0) + 6_000);
    const snippet = html.slice(start, end);
    const listing = parseSearchListingFromText(finnkode, snippet, page);
    if (!listing) continue;
    unique.set(finnkode, listing);
  }

  return [...unique.values()];
}

export async function analyzeFinnSearch(
  searchUrl: URL,
  assumptionsInput: Partial<SuperAssumptions>,
): Promise<{
  results: SuperAnalysis[];
  pagesScanned: number;
  truncated: boolean;
  warnings: string[];
}> {
  const assumptions: SuperAssumptions = { ...SUPER_DEFAULTS, ...assumptionsInput };
  const baseUrl = new URL(searchUrl.toString());
  baseUrl.searchParams.delete("page");

  const warnings: string[] = [];
  const collected = new Map<string, SuperSearchListing>();
  let pagesScanned = 0;
  let page = 1;
  let truncated = false;

  while (page <= DEFAULT_MAX_PAGES) {
    const pageUrl = new URL(baseUrl.toString());
    if (page > 1) pageUrl.searchParams.set("page", String(page));

    const html = await fetchHtml(pageUrl);
    pagesScanned += 1;
    const listings = collectSearchListings(html, page);
    let newOnPage = 0;

    for (const listing of listings) {
      if (collected.has(listing.finnkode)) continue;
      collected.set(listing.finnkode, listing);
      newOnPage += 1;
    }

    if (newOnPage === 0) break;
    if (listings.length === 0) break;
    page += 1;
  }

  if (page > DEFAULT_MAX_PAGES) {
    truncated = true;
    warnings.push(`Stoppet etter ${DEFAULT_MAX_PAGES} sider for å holde analysetiden nede.`);
  }

  const results = [...collected.values()].map((listing) => analyzeListing(listing, assumptions));
  results.sort((left, right) => right.score - left.score);

  if (results.length === 0) {
    warnings.push("FINN returnerte ingen parsebare treff for dette søket akkurat nå.");
  }

  return { results, pagesScanned, truncated, warnings };
}