import { ImageResponse } from "next/og";

export const alt = "Utleiekalkulator – gratis kalkulator for utleiebolig";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
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
            top: "-140px",
            width: "420px",
            height: "420px",
            borderRadius: "9999px",
            background: "rgba(255, 93, 48, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "96px",
            bottom: "88px",
            width: "56px",
            height: "56px",
            borderRadius: "9999px",
            background: "#ff5d30",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#ff5d30",
            }}
          >
            <svg viewBox="0 0 64 64" width="52" height="52">
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
          <div style={{ fontSize: "30px", opacity: 0.85 }}>
            utleie-kalkulator.no
          </div>
        </div>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-2px",
            maxWidth: "900px",
          }}
        >
          Lønner det seg å leie ut?
        </div>
        <div style={{ fontSize: "32px", marginTop: "28px", opacity: 0.8 }}>
          Gratis utleiekalkulator · Kontantstrøm · Yield · Break-even
        </div>
      </div>
    ),
    { ...size },
  );
}
