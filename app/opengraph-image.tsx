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
              background: "#1e5eff",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            kr
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
