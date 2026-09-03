import type { CalcInput } from "@/lib/calc/schema";
import type { FinnParsedData } from "@/lib/finn/types";
import { resolveMunicipality } from "./location";
import { estimateMarketRent, type MarketRentEstimate } from "./market-rent";
import {
  describeEnergy,
  estimateInsurance,
  estimateMaintenancePct,
  type EnergyNote,
  type InsuranceEstimate,
  type MaintenanceEstimate,
} from "./opex-heuristics";
import {
  estimatePropertyTax,
  type PropertyTaxEstimate,
} from "./property-tax";

export type EstimatedCalcField = Extract<
  keyof CalcInput,
  "monthlyRent" | "propertyTaxYearly" | "insuranceYearly" | "maintenancePctOfRent"
>;

export interface ListingResearch {
  municipality: string | null;
  city: string | null;
  postalCode: string | null;
  propertyTax: PropertyTaxEstimate;
  marketRent: MarketRentEstimate;
  insurance: InsuranceEstimate;
  maintenance: MaintenanceEstimate;
  energy: EnergyNote;
  estimatedFields: EstimatedCalcField[];
}

export function enrichListing(finn: FinnParsedData): ListingResearch {
  const city = finn.city;
  const postalCode = finn.postalCode;
  const municipality = resolveMunicipality({ city, postalCode });
  const ownershipIsShare = /andel|aksje/i.test(finn.ownershipTypeRaw ?? "");
  const area = finn.internalArea ?? finn.usableArea;

  const propertyTax = estimatePropertyTax({
    municipality,
    marketValue: finn.askingPrice,
    listingAmount: finn.propertyTaxYearly,
    ownershipIsShare,
  });

  const marketRent = estimateMarketRent({
    municipality,
    city,
    rooms: finn.rooms,
    bedrooms: finn.bedrooms,
    area,
    statedMonthlyRent: finn.statedMonthlyRent,
  });

  const insurance = estimateInsurance({
    propertyType: finn.propertyType,
    area,
  });
  const maintenance = estimateMaintenancePct(finn.buildYear);
  const energy = describeEnergy({
    energyLabel: finn.energyLabel,
    area,
  });

  const estimatedFields: EstimatedCalcField[] = ["monthlyRent", "insuranceYearly"];
  if (finn.buildYear) estimatedFields.push("maintenancePctOfRent");
  if (
    propertyTax.status === "estimated" ||
    propertyTax.status === "from_listing"
  ) {
    estimatedFields.push("propertyTaxYearly");
  }

  return {
    municipality,
    city,
    postalCode,
    propertyTax,
    marketRent,
    insurance,
    maintenance,
    energy,
    estimatedFields,
  };
}
