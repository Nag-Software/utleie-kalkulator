import { getGuide } from "@/lib/guides";
import { guideOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

const meta = getGuide("vedlikeholdsbudsjett-utleiebolig");

export const alt = meta.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return guideOgImage(meta.title);
}
