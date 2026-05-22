import { useEffect, useRef } from 'react';
import { drawPet } from './petSprites';

const CANVAS_SIZE = 140;

function StageCanvas({ stage }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawPet(ctx, 'cat', stage, 0, false);
  }, [stage]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={ref}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          display: 'block',
          border: '1px solid #ccc',
          borderRadius: '6px',
          imageRendering: 'pixelated',
          background: '#fff',
        }}
      />
      <div style={{ marginTop: '6px', fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>
        Stage {stage}
      </div>
    </div>
  );
}

export default function PetTestPage() {
  return (
    <div style={{
      padding: '24px',
      background: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
        Mochi — all 10 stages
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, auto)',
        gap: '16px',
        width: 'fit-content',
      }}>
        {Array.from({ length: 10 }, (_, i) => (
          <StageCanvas key={i} stage={i} />
        ))}
      </div>
    </div>
  );
}
