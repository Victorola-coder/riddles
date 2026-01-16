import { ImageResponse } from 'next/og';

export const alt = 'Riddle Quest - Gamified Riddle Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 1,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              letterSpacing: '-2px',
            }}
          >
            🧩 Riddle Quest
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: 500,
              maxWidth: '900px',
            }}
          >
            Gamified Riddle Platform
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.5',
            }}
          >
            Solve riddles, earn gems, and progress through difficulty levels
          </div>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
              <span style={{ fontSize: '24px' }}>💎</span>
              <span style={{ fontSize: '20px' }}>Gem Economy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <span style={{ fontSize: '20px' }}>Progressive Hints</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <span style={{ fontSize: '20px' }}>Level Progression</span>
            </div>
          </div>
        </div>
        
        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #fbbf24 50%, #8b5cf6 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
