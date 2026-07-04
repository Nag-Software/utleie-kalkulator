import { ImageResponse } from "next/og";

export const alt = "Utleiekalkulator – beregn lønnsomhet på utleiebolig";
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
          background: "linear-gradient(135deg, #0c1a3d 0%, #12306e 40%, #1e5eff 130%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
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
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb 0%, #1c3faf 100%)",
            }}
          >
            <svg viewBox="0 0 64 64" width="56" height="56">
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
          <div style={{ fontSize: "30px", opacity: 0.9 }}>utleie-kalkulator.no</div>
        </div>
        <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.1 }}>
          Lønner det seg å leie ut?
        </div>
        <div style={{ fontSize: "34px", marginTop: "28px", opacity: 0.85 }}>
          Kontantstrøm · Yield · Break-even · KI-vurdering
        </div>
      </div>
    ),
    { ...size },
  );
}
