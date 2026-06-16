import { useEffect, useRef } from 'react';
import { PETS } from './pets';
import { drawPet } from './petSprites';

function PetPreview({ petId, innerBg }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPet(ctx, petId, 0, 0, true);
  }, [petId]);

  return (
    <div className="pet-card-canvas-box" style={{ background: '#ffffff' }}>
      <canvas
        ref={ref}
        width={144}
        height={144}
        style={{ imageRendering: 'pixelated', width: '120px', height: '120px', display: 'block', background: '#ffffff', backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </div>
  );
}

export default function PetPicker({ currentPetId, onSelect, onConfirm, onCancel, isFirstVisit }) {
  return (
    <>
      <div className="pet-picker">
        {PETS.map(pet => (
          <button
            key={pet.id}
            className={`pet-card${currentPetId === pet.id ? ' pet-card-selected' : ''}`}
            style={{ '--pet-color': pet.textColor, '--pet-bg': pet.bg }}
            onClick={() => onSelect(pet.id)}
            aria-pressed={currentPetId === pet.id}
          >
            <PetPreview petId={pet.id} innerBg={pet.innerBg} />
            <span className="pet-card-name" style={{ color: pet.textColor }}>{pet.name}</span>
            <span className="pet-card-desc" style={{ color: pet.textColor }}>{pet.description}</span>
          </button>
        ))}
      </div>
      {!isFirstVisit && (
        <p className="pet-picker-warning">
          Consistency matters — switching companion resets your XP to 0.
        </p>
      )}
      <button className="picker-confirm-btn" onClick={onConfirm}>
        {isFirstVisit ? "LET'S GO!" : 'CONFIRM'}
      </button>
      {!isFirstVisit && onCancel && (
        <button className="picker-cancel-btn" onClick={onCancel}>
          CANCEL
        </button>
      )}
    </>
  );
}
