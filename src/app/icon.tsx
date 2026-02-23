import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
    >
      <span
        style={{
          color: 'white',
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '-0.5px',
        }}
      >
        CA
      </span>
    </div>,
    { ...size }
  )
}
