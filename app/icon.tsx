import { ImageResponse } from "next/og";

// Genererer favicon + manifest-ikoner i flere størrelser (/icon/64 osv.)
const SIZES = [64, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

// I Next 16 leveres id som en Promise
export default async function Icon(props: { id: string | Promise<string> }) {
  const size = Number(await props.id) || 64;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff5d30",
          borderRadius: Math.round(size * 0.25),
        }}
      >
        <svg viewBox="0 0 64 64" width={size} height={size}>
          <path
            d="M14 27.5 L32 12 L50 27.5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 46.5 L27.5 36 L33.5 41.5 L44 31.5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M37.5 31.5 L44 31.5 L44 38"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
