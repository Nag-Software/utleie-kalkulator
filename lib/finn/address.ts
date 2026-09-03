/**
 * Norske FINN-adresser ser typisk slik ut: «Nordlisletta 22, 0952 Oslo».
 * Vi plukker postnummer og poststed uten å kalle noen API.
 */

const ADDRESS_TAIL = /,\s*(\d{4})\s+([^,]+)$/;

export function parseListingAddress(address: string | null | undefined): {
  postalCode: string | null;
  city: string | null;
} {
  if (!address) return { postalCode: null, city: null };
  const match = address.trim().match(ADDRESS_TAIL);
  if (!match) return { postalCode: null, city: null };
  return {
    postalCode: match[1],
    city: match[2].replace(/\s+/g, " ").trim() || null,
  };
}
