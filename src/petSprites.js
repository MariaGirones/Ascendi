// petSprites.js
// Canvas pixel-art drawing for all 6 pets.
// Art grid is 16×16 logical units. S and PAD are computed per draw call from
// the actual canvas dimensions so sprites scale to any canvas size with 10%
// padding on each side — no hardcoded pixel positions.
//
// drawPet(ctx, petId, stage, animFrame, isResting)
//   stage:     0=baby, 1=teen, 2=adult
//   animFrame: 0 or 1 (idle animation cycle)
//   isResting: true when timer is paused/on break

let S = 3;    // canvas pixels per art pixel — updated per draw call
let PAD = 12; // edge padding in canvas pixels — updated per draw call
const f = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x*S+PAD, y*S+PAD, w*S, h*S); };
const d = (ctx, x, y, c) => f(ctx, x, y, 1, 1, c);

// ─── CAT (orange tabby) ───────────────────────────────────────────────────────
function drawCat(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const O='#f4a35c', o='#c07030', P='#ffb6c1', K='#1a1a2e', W='#ffffff', G='#44cc44';
  // droopy eyelid (2-wide dark bar) + one green iris pixel peeking below when awake;
  // rest=true draws only the bar — fully closed line
  const eye = (ex, ey) => { f(ctx,ex,ey,2,1,K); if (!rest) d(ctx,ex+1,ey+1,G); };

  if (stage===0) {
    f(ctx,5,7,6,5,O);
    f(ctx,5,6,3,1,O); d(ctx,6,6,P); d(ctx,6,5,K);
    f(ctx,8,6,3,1,O); d(ctx,9,6,P); d(ctx,9,5,K);
    eye(6,8); eye(9,8);
    d(ctx,8,10,P);
    if (af===1 && !rest) d(ctx,8,11,P);              // tongue
    return;
  }

  if (stage===1) {
    f(ctx,4,6,8,6,O);
    f(ctx,5,5,3,1,O); d(ctx,6,5,P); d(ctx,6,4,K);
    f(ctx,8,5,3,1,O); d(ctx,9,5,P); d(ctx,9,4,K);
    eye(5,8); eye(9,8);
    f(ctx,7,10,2,1,P);
    if (af===1 && !rest) d(ctx,8,11,P);              // tongue
    return;
  }

  if (stage===2) {
    f(ctx,3,5,10,7,O);
    f(ctx,4,4,3,1,O); d(ctx,5,4,P); d(ctx,5,3,K);
    f(ctx,9,4,3,1,O); d(ctx,10,4,P); d(ctx,10,3,K);
    eye(5,7); eye(9,7);
    f(ctx,7,9,2,1,P);
    f(ctx,4,10,8,1,o);
    if (af===1 && !rest) d(ctx,8,10,P);              // tongue (over stripe)
    return;
  }

  if (stage===3) {
    f(ctx,3,4,10,8,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,4,9,8,1,o);
    f(ctx,4,11,8,1,o);
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue (over stripe)
    return;
  }

  if (stage===4) {
    f(ctx,3,4,10,8,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,3,9,10,1,o);
    f(ctx,3,11,10,1,o);
    d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,12,10,o);
    if (af===1) d(ctx,12,11,o);                      // tail tip droops 1 px
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue
    return;
  }

  if (stage===5) {
    f(ctx,3,4,10,9,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,3,9,10,1,o); f(ctx,3,11,10,1,o); f(ctx,3,12,10,1,o);
    d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,12,11,o); d(ctx,11,12,o);
    if (af===1) d(ctx,11,13,o);                      // tail tip droops below body
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue
    return;
  }

  if (stage===6) {
    f(ctx,3,4,10,10,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,3,9,10,1,o); f(ctx,3,11,10,1,o); f(ctx,3,13,10,1,o);
    d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,12,11,o); d(ctx,12,12,o); d(ctx,11,13,o);
    if (af===1) d(ctx,10,13,o);                      // tail tip extends left 1 px
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue
    return;
  }

  if (stage===7) {
    f(ctx,2,4,11,10,O);
    f(ctx,3,3,3,1,O); d(ctx,4,3,P); d(ctx,4,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(4,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,2,9,11,1,o); f(ctx,2,11,11,1,o); f(ctx,2,13,11,1,o);
    d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o);
    if (af===1) d(ctx,9,13,o);                       // tail tip extends left 1 px
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue
    return;
  }

  if (stage===8) {
    f(ctx,2,4,11,10,O);
    f(ctx,3,3,4,1,O); d(ctx,4,3,P); d(ctx,4,2,K);
    f(ctx,9,3,4,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(4,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,2,9,11,1,o); f(ctx,2,10,11,1,o); f(ctx,2,12,11,1,o); f(ctx,2,13,11,1,o);
    d(ctx,13,5,o); d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o); d(ctx,9,13,o);
    if (af===1) d(ctx,8,13,o);                       // tail extends 1 px
    if (af===1 && !rest) d(ctx,8,9,P);               // tongue
    return;
  }

  // stage 9 — Mythic Tabby
  f(ctx,2,4,11,10,O);
  f(ctx,3,3,4,1,O); d(ctx,4,3,P); d(ctx,5,3,P); d(ctx,4,2,K);
  f(ctx,9,3,4,1,O); d(ctx,10,3,P); d(ctx,11,3,P); d(ctx,10,2,K);
  eye(4,6); eye(9,6);
  f(ctx,7,8,2,1,P);
  f(ctx,2,9,11,1,o); f(ctx,2,10,11,1,o); f(ctx,2,12,11,1,o); f(ctx,2,13,11,1,o);
  d(ctx,13,4,o); d(ctx,13,5,o); d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o); d(ctx,9,13,o);
  // pink tip shifts left 1 px on af=1 — visible swish against dark stripe
  if (af===1) { d(ctx,8,13,o); d(ctx,7,13,P); } else d(ctx,8,13,P);
  if (af===1 && !rest) d(ctx,8,9,P);                 // tongue
}

// ─── DOG (golden retriever) ───────────────────────────────────────────────────
function drawDog(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const G='#e8b84b', g='#c49030', K='#1a1a2e', W='#ffffff', T='#a06820';

  function face(ox, oy, sz) {
    const [fw,fh] = [[10,9],[12,10],[14,12]][sz];
    f(ctx,ox,oy,fw,fh,G);
    f(ctx,ox,oy,fw,1,K); f(ctx,ox,oy+fh-1,fw,1,K);
    f(ctx,ox,oy,1,fh,K); f(ctx,ox+fw-1,oy,1,fh,K);
    f(ctx,ox+1,oy+1,fw-2,fh-2,G);
    // floppy ears (hang down from sides)
    f(ctx,ox-2,oy,2,Math.floor(fh*0.7),T);
    f(ctx,ox+fw,oy,2,Math.floor(fh*0.7),T);
    d(ctx,ox-2,oy,K); d(ctx,ox-1,oy,K);
    d(ctx,ox+fw,oy,K); d(ctx,ox+fw+1,oy,K);
    // muzzle
    const mw=Math.floor(fw*0.5), mx=ox+Math.floor(fw*0.25), my=oy+Math.floor(fh*0.5);
    f(ctx,mx,my,mw,Math.floor(fh*0.4),W);
    f(ctx,mx,my,mw,1,K); f(ctx,mx,my+Math.floor(fh*0.4)-1,mw,1,K);
    // eyes
    const ex1=ox+2, ex2=ox+fw-4, ey=oy+Math.floor(fh*0.3);
    if (rest) {
      f(ctx,ex1,ey,2,1,K); f(ctx,ex2,ey,2,1,K);
    } else if (af===1) {
      d(ctx,ex1,ey,K); d(ctx,ex2,ey,K);
    } else {
      f(ctx,ex1,ey,2,2,K); f(ctx,ex2,ey,2,2,K); // dark dog eyes
      d(ctx,ex1,ey,W); d(ctx,ex2,ey,W); // eye shine
    }
    // nose (big dark)
    const nx=ox+Math.floor(fw/2)-1, ny=my+1;
    f(ctx,nx-1,ny,4,2,K);
    d(ctx,nx,ny,W); // nose shine
    // tongue (idle frame 0 only)
    if (!rest && af===0) d(ctx,nx,ny+3,'#ff6b8a');
  }

  if (stage===0) {
    // Tiny puppy: small floating head with a waggy tail nub
    face(3,5,0);
    const tw = af===0 ? 13 : 14;
    d(ctx,tw,11,g);
    d(ctx,tw,12,g);
  } else if (stage===1) {
    // Playful pup: small face + compact 8×3 body + paw nubs + wagging side tail
    face(3,2,0);
    f(ctx,4,11,8,3,G);
    f(ctx,4,11,8,1,K); f(ctx,4,13,8,1,K);
    f(ctx,4,11,1,3,K); f(ctx,11,11,1,3,K);
    f(ctx,5,12,6,1,G);
    f(ctx,5,13,2,1,g); f(ctx,9,13,2,1,g);
    const tw = af===0 ? 12 : 13;
    f(ctx,tw,11,2,3,g);
    d(ctx,tw,11,K); d(ctx,tw+1,13,K);
  } else if (stage===2) {
    // Bounding pup: medium face + 10×3 body + white belly + tail with tip
    face(2,2,1);
    f(ctx,3,12,10,3,G);
    f(ctx,3,12,10,1,K); f(ctx,3,14,10,1,K);
    f(ctx,3,12,1,3,K); f(ctx,12,12,1,3,K);
    f(ctx,4,13,8,1,G);
    f(ctx,6,13,4,1,W);
    f(ctx,4,14,2,1,g); f(ctx,10,14,2,1,g);
    f(ctx,13,12,2,3,g);
    d(ctx,13,12,K); d(ctx,14,14,K); d(ctx,14,15,W);
  } else if (stage===3) {
    // Young dog: medium face + 10×4 body + belly stripe + longer curved tail
    face(2,1,1);
    f(ctx,3,11,10,4,G);
    f(ctx,3,11,10,1,K); f(ctx,3,14,10,1,K);
    f(ctx,3,11,1,4,K); f(ctx,12,11,1,4,K);
    f(ctx,4,12,8,2,G);
    f(ctx,5,12,6,2,W);
    f(ctx,4,14,2,1,g); f(ctx,10,14,2,1,g);
    f(ctx,14,9,2,5,g); f(ctx,13,13,3,1,g);
    d(ctx,14,9,K); d(ctx,15,13,K); d(ctx,15,14,W);
  } else if (stage===4) {
    // Retriever: big face + 14×4 body + white chest + fluffy tail + paw highlights
    face(1,1,2);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,4,14,8,2,W);
    f(ctx,2,16,3,1,g); f(ctx,11,16,3,1,g);
    d(ctx,3,16,W); d(ctx,12,16,W);
    f(ctx,14,10,2,6,g); f(ctx,13,15,3,1,g);
    d(ctx,15,10,K); d(ctx,15,15,K); d(ctx,14,16,W);
  } else if (stage===5) {
    // Confident dog: 4-row body, 5 fur streaks in 2 rows, upright animated left tail
    face(1,1,2);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,2,14,3,1,g); f(ctx,6,14,3,1,g); f(ctx,10,14,3,1,g);
    f(ctx,3,15,3,1,g); f(ctx,9,15,3,1,g);
    f(ctx,2,16,3,1,g); f(ctx,11,16,3,1,g);
    const ty = af===0 ? 9 : 8;
    f(ctx,0,ty,1,5,g);
    d(ctx,0,ty,K); d(ctx,0,ty+4,K);
    d(ctx,0,ty-1,W);
  } else if (stage===6) {
    // Good dog: white belly, flanking fur marks, hooked right tail
    face(1,1,2);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,5,14,6,2,W);
    f(ctx,2,14,2,1,g); f(ctx,12,14,2,1,g);
    f(ctx,2,15,2,1,g); f(ctx,12,15,2,1,g);
    f(ctx,4,14,1,1,g); f(ctx,11,14,1,1,g);
    f(ctx,2,16,3,1,g); f(ctx,11,16,3,1,g);
    f(ctx,14,10,2,4,g); f(ctx,13,13,2,1,g);
    d(ctx,14,10,K); d(ctx,14,13,K); d(ctx,15,9,W);
  } else if (stage===7) {
    // Golden: forehead marks, wide belly, inner fur marks, long sweeping tail, paw highlights
    face(1,1,2);
    f(ctx,5,2,2,1,g); f(ctx,9,2,2,1,g);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,5,14,6,2,W);
    f(ctx,2,14,2,1,g); f(ctx,12,14,2,1,g);
    f(ctx,2,15,2,1,g); f(ctx,12,15,2,1,g);
    f(ctx,4,14,1,1,g); f(ctx,11,14,1,1,g);
    f(ctx,4,15,1,1,g); f(ctx,11,15,1,1,g);
    f(ctx,2,16,3,1,g); f(ctx,11,16,3,1,g);
    d(ctx,3,16,W); d(ctx,12,16,W);
    f(ctx,14,9,2,7,g); f(ctx,13,15,3,1,g);
    d(ctx,14,9,K); d(ctx,15,15,K); d(ctx,15,16,W);
  } else if (stage===8) {
    // Elder hound: white collar, dense 7-mark fur, toe detail, animated thick tail
    face(1,1,2);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,4,14,8,1,W);
    f(ctx,2,14,1,1,g); f(ctx,13,14,1,1,g);
    f(ctx,2,15,3,1,g); f(ctx,5,15,2,1,g); f(ctx,9,15,2,1,g); f(ctx,11,15,3,1,g);
    f(ctx,2,16,3,1,g); f(ctx,11,16,3,1,g);
    d(ctx,3,16,W); d(ctx,4,16,W); d(ctx,12,16,W); d(ctx,13,16,W);
    const tw = af===0 ? 13 : 14;
    f(ctx,tw,10,2,6,g);
    d(ctx,tw,10,K); d(ctx,tw+1,15,K); d(ctx,tw+1,9,W);
  } else {
    // Good Boy: white chest ruff, elaborate markings, big paws, majestic 3-wide tail
    face(1,1,2);
    f(ctx,1,13,14,4,G);
    f(ctx,1,13,14,1,K); f(ctx,1,16,14,1,K);
    f(ctx,1,13,1,4,K); f(ctx,14,13,1,4,K);
    f(ctx,2,14,12,2,G);
    f(ctx,4,14,8,2,W);
    f(ctx,2,14,2,1,g); f(ctx,12,14,2,1,g);
    f(ctx,2,15,2,1,g); f(ctx,12,15,2,1,g);
    f(ctx,4,14,1,1,g); f(ctx,4,15,1,1,g);
    f(ctx,11,14,1,1,g); f(ctx,11,15,1,1,g);
    f(ctx,1,16,4,1,g); f(ctx,11,16,4,1,g);
    d(ctx,2,16,G); d(ctx,3,16,G); d(ctx,12,16,G); d(ctx,13,16,G);
    f(ctx,13,9,3,7,g); f(ctx,12,15,4,2,g);
    d(ctx,13,9,K); d(ctx,15,9,K);
    d(ctx,15,15,K); d(ctx,12,16,K);
  }
}

// ─── DRAGON (dark teal/emerald) ───────────────────────────────────────────────
function drawDragon(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const D='#1abc9c', dk='#0e8a70', K='#1a1a2e', R='#e74c3c', Y='#f1c40f', W='#ffffff';

  if (stage===0) {
    // Plain egg — smooth and mysterious, no cracks
    const ox=3,oy=2;
    f(ctx,ox,oy,10,12,D);
    f(ctx,ox,oy,10,1,K); f(ctx,ox,oy+11,10,1,K);
    f(ctx,ox,oy,1,12,K); f(ctx,ox+9,oy,1,12,K);
    f(ctx,ox+1,oy+1,8,10,D);
    f(ctx,ox+2,oy+2,2,4,W); d(ctx,ox+2,oy+2,D);
    d(ctx,ox+7,oy+3,dk); d(ctx,ox+2,oy+8,dk); d(ctx,ox+7,oy+9,dk); d(ctx,ox+5,oy+5,dk);
    if (!rest && af===0) d(ctx,ox+8,oy+9,Y);
  } else if (stage===1) {
    // Cracked egg — fractures spread, a glowing eye peers out
    const ox=3,oy=2;
    f(ctx,ox,oy,10,12,D);
    f(ctx,ox,oy,10,1,K); f(ctx,ox,oy+11,10,1,K);
    f(ctx,ox,oy,1,12,K); f(ctx,ox+9,oy,1,12,K);
    f(ctx,ox+1,oy+1,8,10,D);
    f(ctx,ox+2,oy+2,2,3,W); d(ctx,ox+2,oy+2,D);
    f(ctx,ox+4,oy+4,1,3,K); f(ctx,ox+5,oy+6,1,2,K);
    f(ctx,ox+3,oy+5,1,1,K); f(ctx,ox+6,oy+7,1,1,K);
    if (!rest) {
      d(ctx,ox+4,oy+8,Y); d(ctx,ox+5,oy+8,Y);
      d(ctx,ox+4,oy+9,K); d(ctx,ox+5,oy+9,K);
    }
    d(ctx,ox+7,oy+3,dk); d(ctx,ox+2,oy+8,dk); d(ctx,ox+7,oy+9,dk);
    if (!rest && af===1) f(ctx,ox+3,oy+4,3,1,K);
  } else if (stage===2) {
    // Whelp — tiny dragon rising from broken shell halves
    f(ctx,1,11,5,4,D); f(ctx,1,11,5,1,K); f(ctx,1,14,5,1,K); f(ctx,1,11,1,4,K); f(ctx,5,11,1,4,K);
    f(ctx,10,11,5,4,D); f(ctx,10,11,5,1,K); f(ctx,10,14,5,1,K); f(ctx,10,11,1,4,K); f(ctx,14,11,1,4,K);
    const ox=5,oy=3;
    f(ctx,ox,oy,6,5,D);
    f(ctx,ox,oy,6,1,K); f(ctx,ox,oy+4,6,1,K);
    f(ctx,ox,oy,1,5,K); f(ctx,ox+5,oy,1,5,K);
    f(ctx,ox+1,oy+1,4,3,D);
    d(ctx,ox+1,oy-1,Y); d(ctx,ox+4,oy-1,Y);
    if (rest) {
      f(ctx,ox+1,oy+2,2,1,K); f(ctx,ox+3,oy+2,2,1,K);
    } else {
      d(ctx,ox+1,oy+2,Y); d(ctx,ox+4,oy+2,Y);
      if (af===0) { d(ctx,ox+1,oy+2,W); d(ctx,ox+4,oy+2,W); }
    }
    f(ctx,ox+1,oy+5,4,4,D);
    f(ctx,ox+1,oy+5,4,1,K); f(ctx,ox+1,oy+8,4,1,K);
    f(ctx,ox+1,oy+5,1,4,K); f(ctx,ox+4,oy+5,1,4,K);
    f(ctx,ox+3,oy+9,3,1,dk); d(ctx,ox+5,oy+9,Y);
  } else if (stage===3) {
    // Hatchling — free of shell, tiny wing nubs appearing
    const ox=4,oy=2;
    f(ctx,ox,oy,8,6,D);
    f(ctx,ox,oy,8,1,K); f(ctx,ox,oy+5,8,1,K);
    f(ctx,ox,oy,1,6,K); f(ctx,ox+7,oy,1,6,K);
    f(ctx,ox+1,oy+1,6,4,D);
    d(ctx,ox+1,oy-1,Y); d(ctx,ox+2,oy-1,Y); d(ctx,ox+5,oy-1,Y); d(ctx,ox+6,oy-1,Y);
    const ey=oy+2;
    if (rest) {
      f(ctx,ox+1,ey,2,1,K); f(ctx,ox+5,ey,2,1,K);
    } else {
      f(ctx,ox+1,ey,2,2,Y); f(ctx,ox+5,ey,2,2,Y);
      d(ctx,ox+2,ey+1,K); d(ctx,ox+6,ey+1,K);
      if (af===0) { d(ctx,ox+1,ey,W); d(ctx,ox+5,ey,W); }
    }
    d(ctx,ox+2,oy+4,K); d(ctx,ox+5,oy+4,K);
    f(ctx,ox,oy+6,8,5,D);
    f(ctx,ox,oy+6,8,1,K); f(ctx,ox,oy+10,8,1,K);
    f(ctx,ox,oy+6,1,5,K); f(ctx,ox+7,oy+6,1,5,K);
    f(ctx,ox+1,oy+7,6,3,D);
    f(ctx,ox-2,oy+7,2,2,dk); d(ctx,ox-2,oy+7,K); d(ctx,ox-1,oy+8,K);
    f(ctx,ox+8,oy+7,2,2,dk); d(ctx,ox+9,oy+7,K); d(ctx,ox+8,oy+8,K);
    f(ctx,ox+5,oy+10,4,2,D); d(ctx,ox+8,oy+11,Y);
  } else if (stage===4) {
    // Sparkling — wings spreading, true dragon form emerging
    const ox=4,oy=2;
    f(ctx,ox,oy,8,6,D);
    f(ctx,ox,oy,8,1,K); f(ctx,ox,oy+5,8,1,K);
    f(ctx,ox,oy,1,6,K); f(ctx,ox+7,oy,1,6,K);
    f(ctx,ox+1,oy+1,6,4,D);
    f(ctx,ox+1,oy-2,2,2,Y); d(ctx,ox+1,oy-2,K); d(ctx,ox+2,oy-2,K);
    f(ctx,ox+5,oy-2,2,2,Y); d(ctx,ox+5,oy-2,K); d(ctx,ox+6,oy-2,K);
    const ey=oy+2;
    if (rest) {
      f(ctx,ox+1,ey,2,1,K); f(ctx,ox+5,ey,2,1,K);
    } else {
      f(ctx,ox+1,ey,2,2,Y); f(ctx,ox+5,ey,2,2,Y);
      d(ctx,ox+2,ey+1,K); d(ctx,ox+6,ey+1,K);
      if (af===0) { d(ctx,ox+1,ey,W); d(ctx,ox+5,ey,W); }
    }
    d(ctx,ox+2,oy+4,K); d(ctx,ox+5,oy+4,K);
    d(ctx,ox+3,oy+5,Y); d(ctx,ox+5,oy+5,Y);
    f(ctx,ox-1,oy+6,10,6,D);
    f(ctx,ox-1,oy+6,10,1,K); f(ctx,ox-1,oy+11,10,1,K);
    f(ctx,ox-1,oy+6,1,6,K); f(ctx,ox+8,oy+6,1,6,K);
    f(ctx,ox,oy+7,8,4,D);
    const wy=af===0?oy+7:oy+6;
    f(ctx,ox-3,wy,3,3,dk); d(ctx,ox-3,wy,K); d(ctx,ox-1,wy+2,K);
    f(ctx,ox+9,wy,3,3,dk); d(ctx,ox+11,wy,K); d(ctx,ox+9,wy+2,K);
    f(ctx,ox+5,oy+11,5,2,D); d(ctx,ox+9,oy+12,Y);
  } else if (stage===5) {
    // Drake — small 3-wide wings, yellow eyes, 2 spines, no teeth
    f(ctx,0,4,3,6,dk); f(ctx,13,4,3,6,dk);
    d(ctx,0,4,K); d(ctx,2,9,K); d(ctx,15,4,K); d(ctx,13,9,K);
    d(ctx,1,6,D); d(ctx,14,6,D);
    f(ctx,2,6,12,9,D);
    f(ctx,2,6,12,1,K); f(ctx,2,14,12,1,K);
    f(ctx,2,6,1,9,K); f(ctx,13,6,1,9,K);
    f(ctx,3,7,10,7,D);
    f(ctx,4,9,2,1,dk); f(ctx,8,9,2,1,dk); f(ctx,6,11,2,1,dk);
    f(ctx,3,1,10,7,D);
    f(ctx,3,1,10,1,K); f(ctx,3,7,10,1,K);
    f(ctx,3,1,1,7,K); f(ctx,12,1,1,7,K);
    f(ctx,4,2,8,5,D);
    d(ctx,5,0,Y); d(ctx,6,0,Y); d(ctx,9,0,Y); d(ctx,10,0,Y);
    if (rest) {
      f(ctx,5,3,3,1,K); f(ctx,9,3,3,1,K);
    } else {
      f(ctx,5,3,2,2,Y); f(ctx,9,3,2,2,Y);
      d(ctx,6,4,K); d(ctx,10,4,K);
      if (af===0) { d(ctx,5,3,W); d(ctx,9,3,W); }
    }
    d(ctx,6,6,K); d(ctx,9,6,K);
    d(ctx,6,1,Y); d(ctx,10,1,Y);
    f(ctx,11,13,4,2,D); d(ctx,14,14,Y);
  } else if (stage===6) {
    // Firedrake — full wings, red eyes, 3 spines, fire breath
    f(ctx,0,2,4,8,dk); f(ctx,12,2,4,8,dk);
    d(ctx,0,2,K); d(ctx,3,9,K); d(ctx,15,2,K); d(ctx,12,9,K);
    d(ctx,1,4,D); d(ctx,1,7,D); d(ctx,13,4,D); d(ctx,14,7,D);
    f(ctx,2,6,12,9,D);
    f(ctx,2,6,12,1,K); f(ctx,2,14,12,1,K);
    f(ctx,2,6,1,9,K); f(ctx,13,6,1,9,K);
    f(ctx,3,7,10,7,D);
    f(ctx,4,9,2,1,dk); f(ctx,8,9,2,1,dk); f(ctx,6,11,2,1,dk); f(ctx,10,11,2,1,dk);
    f(ctx,3,1,10,7,D);
    f(ctx,3,1,10,1,K); f(ctx,3,7,10,1,K);
    f(ctx,3,1,1,7,K); f(ctx,12,1,1,7,K);
    f(ctx,4,2,8,5,D);
    f(ctx,4,0,2,2,Y); d(ctx,4,0,K); d(ctx,5,0,K);
    f(ctx,10,0,2,2,Y); d(ctx,11,0,K);
    if (rest) {
      f(ctx,5,3,3,1,K); f(ctx,9,3,3,1,K);
    } else {
      f(ctx,5,3,3,2,R); f(ctx,9,3,3,2,R);
      d(ctx,6,4,K); d(ctx,10,4,K);
      if (af===0) { d(ctx,5,3,Y); d(ctx,9,3,Y); }
    }
    d(ctx,6,6,K); d(ctx,9,6,K);
    f(ctx,5,7,6,1,K);
    d(ctx,6,7,W); d(ctx,8,7,W); d(ctx,10,7,W);
    f(ctx,11,13,5,2,D); f(ctx,13,15,3,1,D);
    d(ctx,15,13,Y); d(ctx,15,14,Y);
    d(ctx,5,1,Y); d(ctx,7,1,Y); d(ctx,9,1,Y);
    if (!rest && af===0) {
      d(ctx,4,8,R); d(ctx,3,9,'#f39c12'); d(ctx,2,10,Y); d(ctx,1,11,Y);
    }
  } else if (stage===7) {
    // Wyvern — swept-back tall wings reaching top, massive 3-row tail, 4 spines
    f(ctx,0,0,3,7,dk); f(ctx,13,0,3,7,dk);
    d(ctx,0,0,K); d(ctx,2,6,K); d(ctx,15,0,K); d(ctx,13,6,K);
    d(ctx,1,2,D); d(ctx,1,4,D); d(ctx,14,2,D); d(ctx,14,4,D);
    f(ctx,2,6,12,9,D);
    f(ctx,2,6,12,1,K); f(ctx,2,14,12,1,K);
    f(ctx,2,6,1,9,K); f(ctx,13,6,1,9,K);
    f(ctx,3,7,10,7,D);
    f(ctx,4,9,2,1,dk); f(ctx,8,9,2,1,dk); f(ctx,6,11,2,1,dk); f(ctx,10,11,2,1,dk);
    f(ctx,3,1,10,7,D);
    f(ctx,3,1,10,1,K); f(ctx,3,7,10,1,K);
    f(ctx,3,1,1,7,K); f(ctx,12,1,1,7,K);
    f(ctx,4,2,8,5,D);
    f(ctx,4,0,2,2,Y); d(ctx,4,0,K); d(ctx,5,0,K);
    f(ctx,10,0,2,2,Y); d(ctx,11,0,K);
    if (rest) {
      f(ctx,5,3,3,1,K); f(ctx,9,3,3,1,K);
    } else {
      f(ctx,5,3,3,2,R); f(ctx,9,3,3,2,R);
      d(ctx,6,4,K); d(ctx,10,4,K);
      if (af===0) { d(ctx,5,3,Y); d(ctx,9,3,Y); }
    }
    d(ctx,6,6,K); d(ctx,9,6,K);
    f(ctx,5,7,6,1,K);
    d(ctx,6,7,W); d(ctx,8,7,W); d(ctx,10,7,W);
    f(ctx,10,12,6,3,D);
    f(ctx,10,12,1,3,K); f(ctx,10,12,6,1,K);
    d(ctx,15,12,Y); d(ctx,15,13,Y); d(ctx,15,14,Y);
    d(ctx,5,1,Y); d(ctx,7,1,Y); d(ctx,9,1,Y); d(ctx,11,1,Y);
    if (!rest && af===0) {
      d(ctx,4,8,R); d(ctx,3,9,'#f39c12'); d(ctx,2,10,Y);
    }
  } else if (stage===8) {
    // Elder Drake — extra webbing, white belly, dense flanking scales, alternating glowing eyes, 5 spines
    f(ctx,0,2,4,8,dk); f(ctx,12,2,4,8,dk);
    d(ctx,0,2,K); d(ctx,3,9,K); d(ctx,15,2,K); d(ctx,12,9,K);
    d(ctx,1,4,D); d(ctx,1,6,D); d(ctx,1,8,D);
    d(ctx,13,4,D); d(ctx,14,6,D); d(ctx,14,8,D);
    f(ctx,2,6,12,9,D);
    f(ctx,2,6,12,1,K); f(ctx,2,14,12,1,K);
    f(ctx,2,6,1,9,K); f(ctx,13,6,1,9,K);
    f(ctx,3,7,10,7,D);
    f(ctx,5,9,6,4,W);
    f(ctx,4,9,1,1,dk); f(ctx,11,9,1,1,dk);
    f(ctx,4,11,1,1,dk); f(ctx,11,11,1,1,dk); f(ctx,7,12,2,1,dk);
    f(ctx,3,1,10,7,D);
    f(ctx,3,1,10,1,K); f(ctx,3,7,10,1,K);
    f(ctx,3,1,1,7,K); f(ctx,12,1,1,7,K);
    f(ctx,4,2,8,5,D);
    f(ctx,4,0,2,2,Y); d(ctx,4,0,K); d(ctx,5,0,K);
    f(ctx,10,0,2,2,Y); d(ctx,11,0,K);
    d(ctx,4,2,dk); d(ctx,6,2,dk); d(ctx,9,2,dk); d(ctx,11,2,dk);
    if (rest) {
      f(ctx,5,3,3,1,K); f(ctx,9,3,3,1,K);
    } else {
      f(ctx,5,3,3,2,R); f(ctx,9,3,3,2,R);
      d(ctx,6,4,K); d(ctx,10,4,K);
      if (af===0) { d(ctx,5,3,W); d(ctx,9,3,W); }
      else { d(ctx,7,3,W); d(ctx,11,3,W); }
    }
    d(ctx,6,6,K); d(ctx,9,6,K);
    f(ctx,5,7,6,1,K);
    d(ctx,6,7,W); d(ctx,8,7,W); d(ctx,10,7,W);
    f(ctx,11,13,5,2,D); f(ctx,13,15,3,1,D);
    d(ctx,15,13,Y); d(ctx,15,14,Y);
    d(ctx,5,1,Y); d(ctx,6,1,Y); d(ctx,8,1,Y); d(ctx,10,1,Y); d(ctx,11,1,Y);
    if (!rest && af===0) {
      d(ctx,4,8,R); d(ctx,3,9,'#f39c12'); d(ctx,2,10,Y);
    }
  } else {
    // Dragon (stage 9) — Y glow on wing edges, white belly, epic wider tail, fire on both frames
    f(ctx,0,2,4,8,dk); f(ctx,12,2,4,8,dk);
    d(ctx,0,2,K); d(ctx,3,9,K);
    d(ctx,15,2,K); d(ctx,12,9,K);
    d(ctx,1,4,D); d(ctx,1,7,D); d(ctx,13,4,D); d(ctx,14,7,D);
    d(ctx,0,4,Y); d(ctx,0,7,Y); d(ctx,15,4,Y); d(ctx,15,7,Y);
    f(ctx,2,6,12,9,D);
    f(ctx,2,6,12,1,K); f(ctx,2,14,12,1,K);
    f(ctx,2,6,1,9,K); f(ctx,13,6,1,9,K);
    f(ctx,3,7,10,7,D);
    f(ctx,5,9,6,4,W);
    f(ctx,4,9,2,1,dk); f(ctx,8,9,2,1,dk); f(ctx,6,11,2,1,dk); f(ctx,10,11,2,1,dk);
    f(ctx,3,1,10,7,D);
    f(ctx,3,1,10,1,K); f(ctx,3,7,10,1,K);
    f(ctx,3,1,1,7,K); f(ctx,12,1,1,7,K);
    f(ctx,4,2,8,5,D);
    f(ctx,4,0,2,2,Y); d(ctx,4,0,K); d(ctx,5,0,K);
    f(ctx,10,0,2,2,Y); d(ctx,11,0,K);
    if (rest) {
      f(ctx,5,3,3,1,K); f(ctx,9,3,3,1,K);
    } else {
      f(ctx,5,3,3,2,R); f(ctx,9,3,3,2,R);
      d(ctx,6,4,K); d(ctx,10,4,K);
      if (af===0) { d(ctx,5,3,Y); d(ctx,9,3,Y); }
    }
    d(ctx,6,6,K); d(ctx,9,6,K);
    f(ctx,5,7,6,1,K);
    d(ctx,6,7,W); d(ctx,8,7,W); d(ctx,10,7,W);
    f(ctx,10,12,6,3,D); f(ctx,13,15,3,1,D);
    d(ctx,15,12,Y); d(ctx,15,13,Y);
    d(ctx,5,1,Y); d(ctx,7,1,Y); d(ctx,9,1,Y); d(ctx,11,1,Y);
    if (!rest) {
      if (af===0) {
        d(ctx,4,8,R); d(ctx,3,9,'#f39c12'); d(ctx,2,10,Y); d(ctx,1,11,Y);
      } else {
        d(ctx,4,8,'#f39c12'); d(ctx,3,9,Y);
      }
    }
  }
}

// ─── BUNNY (soft lavender) ────────────────────────────────────────────────────
function drawBunny(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const L='#c3aee0', l='#9b82c2', K='#1a1a2e', P='#ffb6c1', W='#ffffff', B='#4a3580';

  function ears(ox,earH,fw) {
    // left ear
    f(ctx,ox+1,0,2,earH,L);
    f(ctx,ox+1,0,2,1,K); f(ctx,ox+1,earH-1,2,1,K);
    f(ctx,ox+1,0,1,earH,K); f(ctx,ox+2,0,1,earH,K);
    d(ctx,ox+1,1,P); // inner pink
    // right ear
    f(ctx,ox+fw-3,0,2,earH,L);
    f(ctx,ox+fw-3,0,2,1,K); f(ctx,ox+fw-3,earH-1,2,1,K);
    f(ctx,ox+fw-3,0,1,earH,K); f(ctx,ox+fw-2,0,1,earH,K);
    d(ctx,ox+fw-3,1,P);
  }

  if (stage===0) {
    const ox=4,oy=4,fw=8,fh=8;
    ears(ox,5,fw); // tall ears even on baby
    f(ctx,ox,oy,fw,fh,L);
    f(ctx,ox,oy,fw,1,K); f(ctx,ox,oy+fh-1,fw,1,K);
    f(ctx,ox,oy,1,fh,K); f(ctx,ox+fw-1,oy,1,fh,K);
    f(ctx,ox+1,oy+1,fw-2,fh-2,L);
    // Cheek puffs
    d(ctx,ox+1,oy+4,P); d(ctx,ox+fw-2,oy+4,P);
    // Eyes
    if (rest) {
      f(ctx,ox+2,oy+2,2,1,K); f(ctx,ox+5,oy+2,2,1,K);
    } else if (af===1) {
      d(ctx,ox+2,oy+2,K); d(ctx,ox+5,oy+2,K); // blink
    } else {
      f(ctx,ox+2,oy+2,2,2,K); f(ctx,ox+5,oy+2,2,2,K);
      d(ctx,ox+2,oy+2,W); d(ctx,ox+5,oy+2,W); // eye shine
    }
    // Nose
    d(ctx,ox+3,oy+5,P); d(ctx,ox+4,oy+5,P);
    // Mouth
    d(ctx,ox+3,oy+6,K); d(ctx,ox+4,oy+6,K);
  } else if (stage===1) {
    const ox=2,oy=4,fw=12,fh=9;
    ears(ox,5,fw);
    f(ctx,ox,oy,fw,fh,L);
    f(ctx,ox,oy,fw,1,K); f(ctx,ox,oy+fh-1,fw,1,K);
    f(ctx,ox,oy,1,fh,K); f(ctx,ox+fw-1,oy,1,fh,K);
    f(ctx,ox+1,oy+1,fw-2,fh-2,L);
    // Cheeks
    f(ctx,ox+1,oy+4,2,2,P); f(ctx,ox+fw-3,oy+4,2,2,P);
    // Eyes
    if (rest) {
      f(ctx,ox+2,oy+2,3,1,K); f(ctx,ox+8,oy+2,3,1,K);
    } else if (af===1) {
      d(ctx,ox+3,oy+2,K); d(ctx,ox+9,oy+2,K);
    } else {
      f(ctx,ox+2,oy+2,3,2,K); f(ctx,ox+8,oy+2,3,2,K);
      d(ctx,ox+2,oy+2,W); d(ctx,ox+8,oy+2,W);
    }
    // Nose
    f(ctx,ox+5,oy+5,2,2,P);
    // Mouth
    d(ctx,ox+4,oy+7,K); d(ctx,ox+7,oy+7,K);
    // Body
    f(ctx,ox+1,oy+fh,fw-2,5,L);
    f(ctx,ox+1,oy+fh,fw-2,1,K); f(ctx,ox+1,oy+fh+4,fw-2,1,K);
    f(ctx,ox+1,oy+fh,1,5,K); f(ctx,ox+fw-2,oy+fh,1,5,K);
    f(ctx,ox+2,oy+fh+1,fw-4,3,L);
    // Fluffy tail
    f(ctx,ox+fw-1,oy+fh+1,2,3,W); d(ctx,ox+fw,oy+fh+1,K);
    // Paws
    f(ctx,ox+2,oy+fh+4,3,1,l); f(ctx,ox+fw-5,oy+fh+4,3,1,l);
  } else {
    // Adult bunny full
    const ox=1,oy=2,fw=14,fh=10;
    ears(ox,4,fw);
    f(ctx,ox,oy,fw,fh,L);
    f(ctx,ox,oy,fw,1,K); f(ctx,ox,oy+fh-1,fw,1,K);
    f(ctx,ox,oy,1,fh,K); f(ctx,ox+fw-1,oy,1,fh,K);
    f(ctx,ox+1,oy+1,fw-2,fh-2,L);
    // Big cheeks
    f(ctx,ox+1,oy+4,3,3,P); f(ctx,ox+fw-4,oy+4,3,3,P);
    // Eyes
    if (rest) {
      f(ctx,ox+3,oy+3,3,1,K); f(ctx,ox+fw-6,oy+3,3,1,K);
    } else if (af===1) {
      d(ctx,ox+4,oy+3,K); d(ctx,ox+fw-5,oy+3,K);
    } else {
      f(ctx,ox+3,oy+3,3,3,K); f(ctx,ox+fw-6,oy+3,3,3,K);
      d(ctx,ox+3,oy+3,W); d(ctx,ox+fw-6,oy+3,W);
      d(ctx,ox+5,oy+5,B); d(ctx,ox+fw-4,oy+5,B);
    }
    // Nose
    f(ctx,ox+6,oy+6,2,2,P);
    // Whiskers
    f(ctx,ox+1,oy+7,4,1,K); f(ctx,ox+fw-5,oy+7,4,1,K);
    // Mouth
    d(ctx,ox+5,oy+8,K); d(ctx,ox+8,oy+8,K);
    // Body
    f(ctx,ox,oy+fh,fw,5,L);
    f(ctx,ox,oy+fh,fw,1,K); f(ctx,ox,oy+fh+4,fw,1,K);
    f(ctx,ox,oy+fh,1,5,K); f(ctx,ox+fw-1,oy+fh,1,5,K);
    f(ctx,ox+1,oy+fh+1,fw-2,3,L);
    // Stripe belly
    f(ctx,ox+4,oy+fh+1,fw-8,3,W);
    // Fluffy tail
    f(ctx,ox+fw-1,oy+fh+1,2,3,W); d(ctx,ox+fw,oy+fh+1,K);
    // Big paws
    f(ctx,ox+2,oy+fh+4,4,1,l); f(ctx,ox+fw-6,oy+fh+4,4,1,l);
    // Ear tip bounce on animation
    if (!rest && af===0) {
      d(ctx,ox+2,0,B); d(ctx,ox+fw-3,0,B); // darker ear tips
    }
  }
}

// ─── FOX (orange-red with white) ─────────────────────────────────────────────
function drawFox(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const F='#e8622a', f2='#f4956a', W='#ffffff', K='#1a1a2e', B='#3a1a00', BK='#222';

  function foxFace(ox,oy,fw,fh) {
    // Main face
    f(ctx,ox,oy,fw,fh,F);
    f(ctx,ox,oy,fw,1,K); f(ctx,ox,oy+fh-1,fw,1,K);
    f(ctx,ox,oy,1,fh,K); f(ctx,ox+fw-1,oy,1,fh,K);
    f(ctx,ox+1,oy+1,fw-2,fh-2,F);
    // pointed ears
    d(ctx,ox+1,oy-2,K); d(ctx,ox+2,oy-2,K); // left ear peak
    f(ctx,ox+1,oy-1,2,1,F);
    d(ctx,ox+fw-3,oy-2,K); d(ctx,ox+fw-2,oy-2,K); // right ear peak
    f(ctx,ox+fw-3,oy-1,2,1,F);
    // ear tips black
    d(ctx,ox+1,oy-2,BK); d(ctx,ox+fw-2,oy-2,BK);
    // white muzzle area
    const mw=Math.floor(fw*0.5), mx=ox+Math.floor(fw*0.25), my=oy+Math.floor(fh*0.45);
    f(ctx,mx,my,mw,fh-Math.floor(fh*0.45)-1,W);
    return {ex1:ox+2,ex2:ox+fw-4,ey:oy+Math.floor(fh*0.3),nx:ox+Math.floor(fw/2)-1,ny:my};
  }

  if (stage===0) {
    const {ex1,ex2,ey,nx,ny} = foxFace(3,5,10,9);
    // Eyes
    if (rest) {
      f(ctx,ex1,ey,2,1,K); f(ctx,ex2,ey,2,1,K);
    } else if (af===1) {
      d(ctx,ex1,ey,K); d(ctx,ex2,ey,K);
    } else {
      f(ctx,ex1,ey,2,2,K); f(ctx,ex2,ey,2,2,K);
      d(ctx,ex1,ey,W); d(ctx,ex2,ey,W);
    }
    // Nose
    d(ctx,nx,ny,K); d(ctx,nx+1,ny,K);
  } else if (stage===1) {
    const {ex1,ex2,ey,nx,ny} = foxFace(2,1,12,9);
    if (rest) {
      f(ctx,ex1,ey,3,1,K); f(ctx,ex2,ey,3,1,K);
    } else if (af===1) {
      d(ctx,ex1+1,ey,K); d(ctx,ex2+1,ey,K);
    } else {
      f(ctx,ex1,ey,3,2,K); f(ctx,ex2,ey,3,2,K);
      d(ctx,ex1,ey,W); d(ctx,ex2,ey,W);
    }
    d(ctx,nx,ny,K); d(ctx,nx+1,ny,K);
    // Body
    f(ctx,3,10,10,4,F);
    f(ctx,3,10,10,1,K); f(ctx,3,13,10,1,K);
    f(ctx,3,10,1,4,K); f(ctx,12,10,1,4,K);
    f(ctx,4,11,8,2,F);
    // White belly
    f(ctx,5,11,6,2,W);
    // Paws
    f(ctx,4,13,2,1,B); f(ctx,10,13,2,1,B); // dark paws
    // Tail (big and bushy)
    const tw=af===0?14:15;
    f(ctx,tw,8,2,6,F); f(ctx,tw+1,8,1,6,f2);
    f(ctx,tw,13,2,2,W); // white tail tip
    d(ctx,tw,8,K); d(ctx,tw,13,K);
  } else {
    const {ex1,ex2,ey,nx,ny} = foxFace(1,0,14,11);
    if (rest) {
      f(ctx,ex1,ey,4,1,K); f(ctx,ex2,ey,4,1,K);
    } else if (af===1) {
      d(ctx,ex1+2,ey,K); d(ctx,ex2+2,ey,K);
    } else {
      f(ctx,ex1,ey,4,3,K); f(ctx,ex2,ey,4,3,K);
      d(ctx,ex1,ey,W); d(ctx,ex2,ey,W); // eye shine
      d(ctx,ex1+3,ey+2,B); d(ctx,ex2+3,ey+2,B); // amber glow
    }
    d(ctx,nx,ny,K); d(ctx,nx+1,ny,K); d(ctx,nx+2,ny,K);
    f(ctx,nx-1,ny+1,5,1,K); // mouth
    // Body
    f(ctx,1,11,14,4,F);
    f(ctx,1,11,14,1,K); f(ctx,1,14,14,1,K);
    f(ctx,1,11,1,4,K); f(ctx,14,11,1,4,K);
    f(ctx,2,12,12,2,F);
    f(ctx,4,12,8,2,W); // big white belly
    f(ctx,2,14,3,1,B); f(ctx,11,14,3,1,B); // black paws
    // Huge bushy tail
    f(ctx,13,7,3,8,F); f(ctx,14,7,2,8,f2);
    f(ctx,13,13,3,3,W); // white tail tip
    d(ctx,15,7,K); d(ctx,15,13,K);
    // Whiskers
    f(ctx,0,6,3,1,K); f(ctx,12,6,3,1,K);
  }
}

// ─── AXOLOTL (pink, external gills) ──────────────────────────────────────────
function drawAxolotl(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const A='#ff91b0', a='#e0607a', K='#1a1a2e', W='#ffffff', G='#ff4466', B='#d63060';

  function gills(ctx, gx, gy, n, h) {
    // n gill stalks of height h at x=gx, going up (in columns spaced 1 apart)
    for (let i=0;i<n;i++) {
      f(ctx,gx+i*2,gy-h,1,h,G);
      d(ctx,gx+i*2,gy-h,B); // tip
    }
  }

  if (stage===0) {
    // Round baby blob
    f(ctx,3,6,10,8,A);
    f(ctx,3,6,10,1,K); f(ctx,3,13,10,1,K);
    f(ctx,3,6,1,8,K); f(ctx,12,6,1,8,K);
    f(ctx,4,7,8,6,A);
    // Tiny gills (2 on each side)
    gills(ctx,1,6,2,2);
    gills(ctx,11,6,2,2);
    // eyes
    const ey=8;
    if (rest) {
      f(ctx,5,ey,2,1,K); f(ctx,9,ey,2,1,K);
    } else {
      f(ctx,5,ey,2,2,K); f(ctx,9,ey,2,2,K);
      d(ctx,5,ey,W); d(ctx,9,ey,W);
      if (af===1) d(ctx,6,ey+1,A); // blink variation
    }
    // Smile
    d(ctx,7,11,K); d(ctx,8,11,K);
    // Tiny legs
    f(ctx,4,13,2,1,a); f(ctx,10,13,2,1,a);
  } else if (stage===1) {
    // Elongated teen
    // Gills (3 per side, taller)
    gills(ctx,1,5,3,3);
    gills(ctx,10,5,3,3);
    // Head
    f(ctx,3,5,10,7,A);
    f(ctx,3,5,10,1,K); f(ctx,3,11,10,1,K);
    f(ctx,3,5,1,7,K); f(ctx,12,5,1,7,K);
    f(ctx,4,6,8,5,A);
    // Body
    f(ctx,4,11,8,4,A);
    f(ctx,4,11,8,1,K); f(ctx,4,14,8,1,K);
    f(ctx,4,11,1,4,K); f(ctx,11,11,1,4,K);
    f(ctx,5,12,6,2,A);
    // Spots on body
    d(ctx,6,12,a); d(ctx,9,12,a);
    // Dorsal fin
    f(ctx,6,9,4,2,G); d(ctx,7,9,B);
    // Eyes
    const ey=7;
    if (rest) {
      f(ctx,5,ey,2,1,K); f(ctx,9,ey,2,1,K);
    } else {
      f(ctx,5,ey,2,2,K); f(ctx,9,ey,2,2,K);
      d(ctx,5,ey,W); d(ctx,9,ey,W);
    }
    // Smile
    d(ctx,6,10,K); d(ctx,7,10,K); d(ctx,8,10,K);
    // Legs (4)
    f(ctx,4,14,2,1,a); f(ctx,10,14,2,1,a);
    f(ctx,5,14,1,2,a); f(ctx,10,14,1,2,a); // front legs down
    // Tail
    f(ctx,10,12,5,3,A); f(ctx,13,12,3,2,a);
    d(ctx,15,12,K); d(ctx,15,13,G);
  } else {
    // Adult: elaborate
    // Big gills (4 per side, branched)
    for (let i=0;i<4;i++) {
      f(ctx,i*2,4,1,4,G); d(ctx,i*2,4,B);
      d(ctx,i*2-1,4,G); // branch
    }
    for (let i=0;i<4;i++) {
      f(ctx,12+i*2,4,1,4,G); d(ctx,12+i*2,4,B);
      d(ctx,13+i*2,4,G);
    }
    // Frilly dorsal fin
    for (let i=4;i<12;i+=2) {
      d(ctx,i,5,G); d(ctx,i,6,B);
    }
    // Head
    f(ctx,2,7,12,7,A);
    f(ctx,2,7,12,1,K); f(ctx,2,13,12,1,K);
    f(ctx,2,7,1,7,K); f(ctx,13,7,1,7,K);
    f(ctx,3,8,10,5,A);
    // Body
    f(ctx,3,13,10,3,A);
    f(ctx,3,13,10,1,K); f(ctx,3,15,10,1,K);
    f(ctx,3,13,1,3,K); f(ctx,12,13,1,3,K);
    f(ctx,4,14,8,1,A);
    // Belly lighter
    f(ctx,5,14,6,1,W);
    // Spots
    d(ctx,5,14,a); d(ctx,8,14,a); d(ctx,10,13,a);
    // Eyes (big)
    const ey=9;
    if (rest) {
      f(ctx,4,ey,3,1,K); f(ctx,9,ey,3,1,K);
    } else {
      f(ctx,4,ey,3,3,K); f(ctx,9,ey,3,3,K);
      d(ctx,4,ey,W); d(ctx,9,ey,W);
      d(ctx,6,ey+2,A); d(ctx,11,ey+2,A); // blink var
      if (!af) { d(ctx,5,ey,W); d(ctx,10,ey,W); }
    }
    // Smile
    f(ctx,6,12,4,1,K); d(ctx,7,12,A); d(ctx,8,12,A); // curved smile
    // All 4 legs
    f(ctx,4,15,2,1,a); f(ctx,10,15,2,1,a);
    // Long feathery tail
    f(ctx,11,13,5,3,A); f(ctx,14,12,2,4,a);
    d(ctx,15,12,G); d(ctx,15,15,G); // tail frills
    d(ctx,14,11,G);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

const DRAW_FUNCTIONS = { cat: drawCat, dog: drawDog, dragon: drawDragon, bunny: drawBunny, fox: drawFox, axolotl: drawAxolotl };

export function drawPet(ctx, petId, stage, animFrame, isResting) {
  const size = Math.min(ctx.canvas.width, ctx.canvas.height);
  S = Math.max(1, Math.floor(size * 0.65 / 16));
  PAD = Math.round((size - S * 16) / 2);
  const fn = DRAW_FUNCTIONS[petId];
  if (fn) fn(ctx, stage, animFrame, isResting);
}
