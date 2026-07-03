/** Clientsafe typer for FINN-data (henting/parsing skjer server-side). */

export interface FinnParsedData {
  finnkode: string;
  url: string;
  title: string | null;
  address: string | null;
  imageUrl: string | null;
  askingPrice: number | null;
  totalPrice: number | null;
  sharedDebt: number | null;
  hoaFeesMonthly: number | null;
  transactionCosts: number | null;
  taxValue: number | null;
  propertyType: string | null;
  ownershipTypeRaw: string | null;
  bedrooms: number | null;
  rooms: number | null;
  internalArea: number | null;
  usableArea: number | null;
  floor: number | null;
  buildYear: number | null;
  municipalFeesYearly: number | null;
  propertyTaxYearly: number | null;
  energyLabel: string | null;
  plotArea: number | null;
}

export interface FinnPreview {
  finnkode: string;
  title: string | null;
  address: string | null;
  askingPrice: number | null;
  totalPrice: number | null;
  propertyType: string | null;
  ownershipType: string | null;
  imageUrl: string | null;
}

export type FinnErrorCode =
  | "INVALID_URL"
  | "NOT_FOUND"
  | "BLOCKED"
  | "TIMEOUT"
  | "PARSE_FAIL";
