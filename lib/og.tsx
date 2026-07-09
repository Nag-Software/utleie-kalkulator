import { ImageResponse } from "next/og";

/**
 * Delt mal for dynamiske OpenGraph-bilder. Guidemappene har hver sin
 * opengraph-image.tsx som kaller guideOgImage med sin tittel, så
 * delingsbilder i sosiale medier/søk alltid matcher sidens innhold.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

function LogoMark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb 0%, #1c3faf 100%)",
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
  );
}

export function guideOgImage(title: string) {
  const titleFontSize = title.length > 48 ? 52 : 60;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0c1a3d 0%, #12306e 40%, #1e5eff 130%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <LogoMark size={48} />
          <div style={{ fontSize: "28px", opacity: 0.9 }}>
            utleie-kalkulator.no
          </div>
          <div
            style={{
              marginLeft: "8px",
              padding: "6px 18px",
              borderRadius: "999px",
              border: "2px solid rgba(255,255,255,0.35)",
              fontSize: "22px",
              opacity: 0.9,
            }}
          >
            Guide
          </div>
        </div>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: "28px", opacity: 0.85 }}>
          Gratis utleiekalkulator · Kontantstrøm · Yield · Skatt
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
