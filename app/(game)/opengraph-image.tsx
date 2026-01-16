import { ImageResponse } from "next/og";

export const alt = "Riddle Quest - Play Now";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Default game page OG image
  const difficulty = "easy";

  const difficultyColors = {
    easy: "#10b981",
    medium: "#fbbf24",
    hard: "#ef4444",
  };

  const difficultyEmojis = {
    easy: "🟢",
    medium: "🟡",
    hard: "🔴",
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${difficultyColors[difficulty]}20 0%, transparent 70%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            zIndex: 1,
            maxWidth: "1000px",
          }}
        >
          {/* Game title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%)",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "center",
            }}
          >
            🧩 Riddle Quest
          </div>

          {/* Game status */}
          <div
            style={{
              fontSize: "36px",
              color: "#ffffff",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Challenge Your Mind
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
            }}
          >
            Solve riddles, earn gems, and unlock new challenges
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "24px",
              padding: "16px 32px",
              background: `linear-gradient(135deg, ${difficultyColors[difficulty]} 0%, ${difficultyColors[difficulty]}CC 100%)`,
              borderRadius: "12px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Play Now →
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${difficultyColors[difficulty]} 0%, #8b5cf6 100%)`,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
