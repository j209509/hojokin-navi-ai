/*
 * app/opengraph-image.tsx
 * ─────────────────────────────────────────────────────────────
 * Next.js ImageResponse による OGP 画像自動生成
 * サイズ: 1200×630px (Twitter Card / OGP 推奨サイズ)
 * アクセス: /opengraph-image
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "補助金ナビAI — 最適な補助金をAIが自動マッチング";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background dots pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.2)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.2)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
            padding: "0 80px",
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 40,
              padding: "8px 20px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ✦
            </div>
            <span style={{ color: "#bfdbfe", fontSize: 18, fontWeight: 600 }}>
              補助金ナビAI
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            補助金、見つけるより
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              background: "linear-gradient(90deg, #fde047, #fb923c)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.15,
              marginBottom: 28,
            }}
          >
            使う時代へ。
          </div>

          {/* Sub copy */}
          <div
            style={{
              fontSize: 24,
              color: "#bfdbfe",
              lineHeight: 1.5,
              marginBottom: 40,
              maxWidth: 800,
            }}
          >
            AIが全国2,400件の補助金から最適なものを発見。申請書の下書きまで5分で完了。
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
            }}
          >
            {[
              { value: "2,400件以上", label: "対応補助金" },
              { value: "3分以内", label: "マッチング時間" },
              { value: "無料から", label: "始められる" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  padding: "16px 28px",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fde047",
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: 14, color: "#93c5fd", marginTop: 4 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
