import { getPetById, getStageIndex, MAX_XP } from './pets';
import PixelPet from './PixelPet';

export default function PetDisplay({ petId, xp, gainCount, isRunning, mode }) {
  const pet           = getPetById(petId);
  const thresholds    = pet.stageThresholds;
  const maxStageIndex = thresholds.length - 1;
  const stageIndex    = getStageIndex(xp, petId);
  const isFullyEvolved = stageIndex >= maxStageIndex;
  const isMaxXP       = xp >= MAX_XP;
  const nextThreshold = isFullyEvolved ? null : thresholds[stageIndex + 1];
  const xpToNext      = nextThreshold !== null ? nextThreshold - xp : 0;
  const barPct        = Math.min(100, (xp / MAX_XP) * 100);

  // One marker per stage boundary, skipping the first (it's the bar's left edge).
  const markerPcts = thresholds.slice(1).map(t => (t / MAX_XP) * 100);

  // Stage labels: always show S1 at the left; for pets with > 5 stages show
  // only every other label to avoid crowding the narrow bar.
  const labelStep = thresholds.length > 5 ? 2 : 1;
  const stageLabels = thresholds
    .map((t, i) => ({ i, pct: (t / MAX_XP) * 100 }))
    .filter(({ i }) => i % labelStep === 0);

  return (
    <div
      className="pet-display"
      style={{ '--pet-color': pet.color, '--pet-bg': pet.bg }}
    >
      {/* ── Sprite ── */}
      {mode === 'shortBreak' || mode === 'longBreak' ? (
        <div className="sleep-box-large">
          <span className="z1">Z</span>
          <span className="z2">z</span>
          <span className="z3">z</span>
          <span className="z4">z</span>
        </div>
      ) : (
        <div className="pet-frame">
          <PixelPet
            petId={petId}
            stageIndex={stageIndex}
            isRunning={isRunning}
            gainCount={gainCount}
          />
        </div>
      )}
      <p className="pet-name">{pet.name}</p>

      {/* ── XP bar ── */}
      <div className="xp-section">
        <div className="xp-label-row">
          <span className="xp-count">Stage {stageIndex + 1} · XP {xp} / {MAX_XP}</span>
          {isMaxXP ? (
            <span className="xp-status xp-maxed">✨ Max XP!</span>
          ) : isFullyEvolved ? (
            <span className="xp-status">Fully evolved</span>
          ) : (
            <span className="xp-status">{xpToNext} XP → Stage {stageIndex + 2}</span>
          )}
        </div>

        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${barPct}%` }} />
          {markerPcts.map((pct, i) => (
            <div key={i} className="xp-marker" style={{ left: `${pct}%` }} />
          ))}
        </div>

        <div className="xp-stage-labels">
          {stageLabels.map(({ i, pct }) =>
            i === 0
              ? <span key={i}>S1</span>
              : <span key={i} style={{ left: `${pct}%` }}>S{i + 1}</span>
          )}
        </div>
      </div>
    </div>
  );
}
