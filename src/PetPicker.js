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
    drawPet(ctx, petId, 0, 0, true, '#ffffff');
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

export default function PetPicker({ currentPetId, onSelect, onConfirm, onCancel, isFirstVisit, t }) {
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
          {t.consistencyWarning}
        </p>
      )}
      <button className="picker-confirm-btn" onClick={onConfirm}>
        {isFirstVisit ? t.letsGo : t.confirm}
      </button>
      {!isFirstVisit && onCancel && (
        <button className="picker-cancel-btn" onClick={onCancel}>
          {t.cancel}
        </button>
      )}
    </>
  );
}
