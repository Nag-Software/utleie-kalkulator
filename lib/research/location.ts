/**
 * Kommune fra poststed eller postnummer. Kun de stedene vi har satser for
 * i eiendomsskatte-tabellen trenger treff her; resten blir «ukjent».
 */

const CITY_ALIASES: Record<string, string> = {
  oslo: "Oslo",
  bergen: "Bergen",
  trondheim: "Trondheim",
  stavanger: "Stavanger",
  kristiansand: "Kristiansand",
  tromsø: "Tromsø",
  tromso: "Tromsø",
  drammen: "Drammen",
  bærum: "Bærum",
  baerum: "Bærum",
  sandvika: "Bærum",
  lysaker: "Bærum",
  fornebu: "Bærum",
  asker: "Asker",
};

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/kommune$/i, "")
    .replace(/[^a-zæøå]/g, "")
    .trim();
}

export function municipalityFromCity(city: string | null | undefined): string | null {
  if (!city) return null;
  const aliased = CITY_ALIASES[fold(city)];
  if (aliased) return aliased;
  // «Oslo» folder til «oslo» og treffer; «Kristiansand S» også etter strip.
  const folded = fold(city);
  return CITY_ALIASES[folded] ?? null;
}

/** Grovt postnummer-intervall når poststedet mangler eller er et bydelsnavn. */
export function municipalityFromPostal(
  postalCode: string | null | undefined,
): string | null {
  if (!postalCode || !/^\d{4}$/.test(postalCode)) return null;
  const n = Number.parseInt(postalCode, 10);
  if (n >= 1 && n <= 1299) return "Oslo";
  if (n >= 1300 && n <= 1359) return "Bærum";
  if (n >= 5000 && n <= 5899) return "Bergen";
  if (n >= 7000 && n <= 7099) return "Trondheim";
  if (n >= 4000 && n <= 4099) return "Stavanger";
  if (n >= 4600 && n <= 4699) return "Kristiansand";
  if (n >= 9000 && n <= 9099) return "Tromsø";
  if (n >= 3000 && n <= 3049) return "Drammen";
  return null;
}

export function resolveMunicipality(options: {
  city: string | null;
  postalCode: string | null;
}): string | null {
  return (
    municipalityFromCity(options.city) ??
    municipalityFromPostal(options.postalCode)
  );
}
