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
        background: "#ff5d30",
      }}
    >
      <svg viewBox="0 0 64 64" width={size - 6} height={size - 6}>
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
          background: "#111111",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-140px",
            bottom: "-160px",
            width: "440px",
            height: "440px",
            borderRadius: "9999px",
            background: "rgba(255, 93, 48, 0.14)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <LogoMark size={48} />
          <div style={{ fontSize: "28px", opacity: 0.85 }}>
            utleie-kalkulator.no
          </div>
          <div
            style={{
              marginLeft: "8px",
              padding: "6px 18px",
              borderRadius: "999px",
              border: "2px solid #ff5d30",
              color: "#ff5d30",
              fontSize: "22px",
            }}
          >
            Guide
          </div>
        </div>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-1px",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: "28px", opacity: 0.8 }}>
          Gratis utleiekalkulator · Kontantstrøm · Yield · Skatt
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
