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
  const O='#f4a35c', o='#c07030', P='#ffb6c1', K='#1a1a2e';
  const eye = (ex, ey) => { d(ctx,ex,ey,K); };

  if (stage <= 4) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);

    if (stage===0) {
      f(ctx,5,7,6,5,O);
      f(ctx,5,6,3,1,O); d(ctx,6,6,P); d(ctx,6,5,K);
      f(ctx,8,6,3,1,O); d(ctx,9,6,P); d(ctx,9,5,K);
      eye(6,8); eye(9,8);
      d(ctx,8,10,P);
    } else if (stage===1) {
      f(ctx,4,6,8,6,O);
      f(ctx,5,5,3,1,O); d(ctx,6,5,P); d(ctx,6,4,K);
      f(ctx,8,5,3,1,O); d(ctx,9,5,P); d(ctx,9,4,K);
      eye(5,8); eye(9,8);
      f(ctx,7,10,2,1,P);
    } else if (stage===2) {
      f(ctx,3,5,10,7,O);
      f(ctx,4,4,3,1,O); d(ctx,5,4,P); d(ctx,5,3,K);
      f(ctx,9,4,3,1,O); d(ctx,10,4,P); d(ctx,10,3,K);
      eye(5,7); eye(9,7);
      f(ctx,7,9,2,1,P);
      f(ctx,4,10,8,1,o);
    } else if (stage===3) {
      f(ctx,3,4,10,8,O);
      f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
      f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
      eye(5,6); eye(9,6);
      f(ctx,7,8,2,1,P);
      f(ctx,4,9,8,1,o);
      f(ctx,4,11,8,1,o);
    } else {
      f(ctx,3,4,10,8,O);
      f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
      f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
      eye(5,6); eye(9,6);
      f(ctx,7,8,2,1,P);
      f(ctx,3,9,10,1,o);
      f(ctx,3,11,10,1,o);
      d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,12,10,o);
    }

    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);

  if (stage===5) {
    f(ctx,3,4,10,9,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,3,9,10,1,o); f(ctx,3,11,10,1,o); f(ctx,3,12,10,1,o);
    d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,12,11,o); d(ctx,11,12,o);
  } else if (stage===6) {
    f(ctx,3,4,10,10,O);
    f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,3,9,10,1,o); f(ctx,3,11,10,1,o); f(ctx,3,13,10,1,o);
    d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,12,11,o); d(ctx,12,12,o); d(ctx,11,13,o);
  } else if (stage===7) {
    f(ctx,2,4,11,10,O);
    f(ctx,3,3,3,1,O); d(ctx,4,3,P); d(ctx,4,2,K);
    f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(4,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,2,9,11,1,o); f(ctx,2,11,11,1,o); f(ctx,2,13,11,1,o);
    d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o);
  } else if (stage===8) {
    f(ctx,2,4,11,10,O);
    f(ctx,3,3,4,1,O); d(ctx,4,3,P); d(ctx,4,2,K);
    f(ctx,9,3,4,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
    eye(4,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,2,9,11,1,o); f(ctx,2,10,11,1,o); f(ctx,2,12,11,1,o); f(ctx,2,13,11,1,o);
    d(ctx,13,5,o); d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o); d(ctx,9,13,o);
  } else {
    // stage 9 — Mythic Tabby
    f(ctx,2,4,11,10,O);
    f(ctx,3,3,4,1,O); d(ctx,4,3,P); d(ctx,5,3,P); d(ctx,4,2,K);
    f(ctx,9,3,4,1,O); d(ctx,10,3,P); d(ctx,11,3,P); d(ctx,10,2,K);
    eye(4,6); eye(9,6);
    f(ctx,7,8,2,1,P);
    f(ctx,2,9,11,1,o); f(ctx,2,10,11,1,o); f(ctx,2,12,11,1,o); f(ctx,2,13,11,1,o);
    d(ctx,13,4,o); d(ctx,13,5,o); d(ctx,13,6,o); d(ctx,13,7,o); d(ctx,13,8,o); d(ctx,13,9,o); d(ctx,13,10,o); d(ctx,13,11,o); d(ctx,12,12,o); d(ctx,11,13,o); d(ctx,10,13,o); d(ctx,9,13,o);
    d(ctx,8,13,P);
  }

  ctx.restore();
}

// ─── DOG (golden retriever blob) ─────────────────────────────────────────────
function drawDog(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const G='#e8b84b', g='#c49030', P='#ffb6c1', N='#8B4513', K='#1a1a2e', R='#c0392b';
  const eye = (ex, ey) => { d(ctx, ex, ey, K); };

  if (stage <= 4) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);

    if (stage===0) {
      f(ctx,5,7,6,5,G);
      f(ctx,3,7,2,3,g); f(ctx,11,7,2,3,g);
      eye(6,9); eye(9,9);
      d(ctx,8,10,N);
    } else if (stage===1) {
      f(ctx,4,6,8,6,G);
      f(ctx,2,6,2,4,g); f(ctx,12,6,2,4,g);
      eye(5,8); eye(9,8);
      f(ctx,7,10,2,1,N);
    } else if (stage===2) {
      f(ctx,3,5,10,7,G);
      f(ctx,2,5,2,5,g); f(ctx,12,5,2,5,g);
      eye(5,7); eye(9,7);
      f(ctx,7,9,2,1,N);
      f(ctx,4,10,8,1,g);
    } else if (stage===3) {
      f(ctx,3,4,10,8,G);
      f(ctx,2,5,2,3,G); f(ctx,2,5,1,3,g);
      f(ctx,12,5,2,3,G); f(ctx,13,5,1,3,g);
      eye(5,6); eye(9,6);
      d(ctx,7,8,N);
      if(af===1) d(ctx,7,9,P);
    } else {
      f(ctx,3,4,10,9,G);
      f(ctx,2,5,2,3,G); f(ctx,2,5,1,3,g);
      f(ctx,12,5,2,3,G); f(ctx,13,5,1,3,g);
      eye(5,6); eye(9,6);
      d(ctx,7,8,N);
      if(af===1) d(ctx,7,9,P);
    }

    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);

  if (stage===5) {
    f(ctx,3,4,10,10,G);
    f(ctx,2,5,2,4,G); f(ctx,2,5,1,4,g);
    f(ctx,12,5,2,4,G); f(ctx,13,5,1,4,g);
    d(ctx,7,3,g); d(ctx,8,3,g);
    eye(5,6); eye(9,6);
    d(ctx,7,8,N);
    if(af===1) d(ctx,7,9,P);
  } else if (stage===6) {
    f(ctx,3,4,10,10,G);
    f(ctx,2,5,2,5,G); f(ctx,2,5,1,5,g);
    f(ctx,12,5,2,5,G); f(ctx,13,5,1,5,g);
    d(ctx,6,3,g); d(ctx,7,3,g); d(ctx,8,3,g);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,N);
    if(af===1) d(ctx,7,9,P);
  } else if (stage===7) {
    f(ctx,3,3,10,11,G);
    f(ctx,2,5,2,6,G); f(ctx,2,5,1,6,g);
    f(ctx,12,5,2,6,G); f(ctx,13,5,1,6,g);
    f(ctx,6,2,4,1,g);
    eye(5,6); eye(9,6);
    f(ctx,7,8,2,1,N);
    d(ctx,4,7,P); d(ctx,10,7,P);
    if(af===1) d(ctx,7,9,P);
  } else if (stage===8) {
    f(ctx,3,3,10,11,G);
    f(ctx,2,5,2,7,G); f(ctx,2,5,1,7,g);
    f(ctx,12,5,2,7,G); f(ctx,13,5,1,7,g);
    f(ctx,5,2,6,1,g);
    eye(5,6); eye(9,6);
    f(ctx,6,8,3,1,N);
    f(ctx,4,7,1,2,P); f(ctx,10,7,1,2,P);
    if(af===1) d(ctx,7,9,P);
  } else {
    f(ctx,3,3,10,11,G);
    f(ctx,2,5,2,8,G); f(ctx,2,5,1,8,g);
    f(ctx,12,5,2,8,G); f(ctx,13,5,1,8,g);
    f(ctx,4,2,8,1,g);
    eye(5,6); eye(9,6);
    f(ctx,6,8,3,1,N);
    f(ctx,4,7,2,2,P); f(ctx,10,7,2,2,P);
    if(af===1) d(ctx,7,9,P);
    f(ctx,3,11,10,1,R);
  }

  ctx.restore();
}

// ─── DRAGON (dark teal/emerald) ───────────────────────────────────────────────
function drawDragon(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const D='#1abc9c', dk='#0e8a70', K='#1a1a2e', R='#e74c3c', Y='#f1c40f', W='#ffffff';
  const O='#e8622a', o='#c04b1c', B='#f4956a';
  const RE='#c0392b', re='#a93226', BL='#2980b9', bl='#1a5276', FA='#f39c12';
  const eye=(ex,ey)=>{d(ctx,ex,ey,K);};

  if (stage===0) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    // Rounded oval egg body
    f(ctx,7,2,2,1,D);
    f(ctx,6,3,4,1,D);
    f(ctx,4,4,8,1,D);
    f(ctx,3,5,10,7,D);   // y=5-11, widest section
    f(ctx,4,12,8,1,D);
    f(ctx,6,13,4,1,D);
    // Right-edge shading for depth
    f(ctx,12,5,1,7,dk);
    d(ctx,11,12,dk);
    // Shine spot top-left
    f(ctx,5,5,2,2,W);
    d(ctx,6,6,D);
    ctx.restore();
  } else if (stage===1) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    // Same rounded oval egg body
    f(ctx,7,2,2,1,D);
    f(ctx,6,3,4,1,D);
    f(ctx,4,4,8,1,D);
    f(ctx,3,5,10,7,D);
    f(ctx,4,12,8,1,D);
    f(ctx,6,13,4,1,D);
    // Right-edge shading
    f(ctx,12,5,1,7,dk);
    d(ctx,11,12,dk);
    // Smaller shine (cracks have appeared)
    f(ctx,5,5,2,1,W);
    // Yellow crack lines radiating from center
    d(ctx,8,3,Y);                              // crack tip at top
    d(ctx,8,4,Y); d(ctx,9,4,Y);               // main + right branch
    d(ctx,7,5,Y); d(ctx,10,5,Y);              // zigzag + right branch
    d(ctx,7,6,Y); d(ctx,6,6,Y);               // main + left branch
    d(ctx,8,7,Y); d(ctx,9,7,Y); d(ctx,5,7,Y); // main zigzag + branches
    d(ctx,8,8,Y); d(ctx,10,8,Y);              // main + right branch
    d(ctx,7,9,Y);
    d(ctx,7,10,Y);                             // crack end lower-left
    ctx.restore();
  } else if (stage===2) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,6,8,6,O);
    d(ctx,3,8,o); d(ctx,12,8,o);
    eye(6,8); eye(9,8);
    ctx.restore();
  } else if (stage===3) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,5,8,7,O);
    f(ctx,3,6,1,2,o); f(ctx,12,6,1,2,o);
    d(ctx,8,4,Y);
    eye(6,7); eye(9,7);
    ctx.restore();
  } else if (stage===4) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,4,8,8,O);
    f(ctx,5,8,4,2,B);
    f(ctx,2,6,2,3,o); f(ctx,12,6,2,3,o);
    d(ctx,12,11,o); d(ctx,13,12,o);
    d(ctx,8,3,Y);
    eye(6,6); eye(9,6);
    ctx.restore();
  } else if (stage===5) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,4,8,8,RE);
    f(ctx,5,7,4,3,B);
    d(ctx,3,5,re); f(ctx,2,6,2,1,re); f(ctx,1,7,3,1,re);
    d(ctx,12,5,re); f(ctx,12,6,2,1,re); f(ctx,12,7,3,1,re);
    d(ctx,12,11,re); d(ctx,13,12,re); d(ctx,14,13,re);
    d(ctx,8,3,Y);
    eye(6,6); eye(9,6);
    ctx.restore();
  } else if (stage===6) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,3,8,9,RE);
    f(ctx,5,7,4,4,B);
    d(ctx,3,3,re); f(ctx,2,4,2,1,re); f(ctx,1,5,3,1,re); f(ctx,1,6,3,1,re);
    d(ctx,12,3,re); f(ctx,12,4,2,1,re); f(ctx,12,5,3,1,re); f(ctx,12,6,3,1,re);
    f(ctx,12,11,2,1,re); d(ctx,13,12,re); d(ctx,13,13,re); d(ctx,12,14,re);
    d(ctx,7,2,Y); d(ctx,9,2,Y);
    eye(6,5); eye(9,5);
    ctx.restore();
  } else if (stage===7) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,3,8,9,BL);
    f(ctx,5,6,4,5,B);
    d(ctx,3,2,bl); f(ctx,2,3,2,1,bl); f(ctx,1,4,3,1,bl); f(ctx,1,5,3,1,bl); f(ctx,1,6,3,1,bl);
    d(ctx,12,2,bl); f(ctx,12,3,2,1,bl); f(ctx,12,4,3,1,bl); f(ctx,12,5,3,1,bl); f(ctx,12,6,3,1,bl);
    d(ctx,12,10,bl); d(ctx,13,11,bl); d(ctx,13,12,bl); d(ctx,12,13,bl); d(ctx,12,14,bl);
    d(ctx,6,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,7,2,Y);
    d(ctx,9,1,Y); d(ctx,8,2,Y); d(ctx,9,2,Y); d(ctx,10,2,Y);
    d(ctx,12,9,R); d(ctx,12,8,FA); d(ctx,12,7,FA); d(ctx,13,8,Y); d(ctx,13,7,Y);
    eye(6,5); eye(9,5);
    ctx.restore();
  } else if (stage===8) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,3,8,9,BL);
    f(ctx,5,6,4,5,B);
    d(ctx,3,2,bl); f(ctx,2,3,2,1,bl); f(ctx,1,4,3,1,bl); f(ctx,1,5,3,1,bl); f(ctx,1,6,3,1,bl); f(ctx,1,7,2,1,bl);
    d(ctx,12,2,bl); f(ctx,12,3,2,1,bl); f(ctx,12,4,3,1,bl); f(ctx,12,5,3,1,bl); f(ctx,12,6,3,1,bl); f(ctx,13,7,2,1,bl);
    d(ctx,12,10,bl); d(ctx,13,11,bl); d(ctx,13,12,bl); d(ctx,12,13,bl); d(ctx,11,14,bl); d(ctx,10,14,bl);
    d(ctx,6,1,Y); d(ctx,7,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,7,2,Y); d(ctx,5,3,Y); d(ctx,7,3,Y);
    d(ctx,9,1,Y); d(ctx,10,1,Y); d(ctx,8,2,Y); d(ctx,9,2,Y); d(ctx,10,2,Y); d(ctx,8,3,Y); d(ctx,10,3,Y);
    d(ctx,12,9,R); d(ctx,12,8,R); d(ctx,12,7,FA); d(ctx,13,8,FA); d(ctx,13,9,Y); d(ctx,14,8,Y); d(ctx,14,9,'#fff176');
    eye(6,5); eye(9,5);
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,3,8,9,BL);
    f(ctx,5,5,4,6,B);
    d(ctx,3,2,bl); f(ctx,2,3,2,1,bl); f(ctx,1,4,3,5,bl); d(ctx,2,9,bl);
    d(ctx,12,2,bl); f(ctx,12,3,2,1,bl); f(ctx,12,4,3,5,bl); d(ctx,13,9,bl);
    d(ctx,12,10,bl); d(ctx,13,11,bl); d(ctx,13,12,bl); d(ctx,12,13,bl); f(ctx,10,14,2,1,bl);
    d(ctx,5,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,4,3,Y); d(ctx,5,3,Y); d(ctx,6,3,Y);
    d(ctx,8,1,Y); d(ctx,7,2,Y); d(ctx,8,2,Y); d(ctx,9,2,Y);
    d(ctx,11,1,Y); d(ctx,10,2,Y); d(ctx,11,2,Y); d(ctx,10,3,Y); d(ctx,11,3,Y); d(ctx,12,3,Y);
    d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,11,8,FA); d(ctx,12,9,FA); d(ctx,14,9,FA); d(ctx,13,10,Y); d(ctx,14,10,Y); d(ctx,12,11,Y); d(ctx,14,11,'#fff176'); d(ctx,14,12,'#fff176');
    eye(6,5); eye(9,5);
    ctx.restore();
  }
}

// ─── BUNNY (soft lavender) ────────────────────────────────────────────────────
function drawBunny(ctx, stage, af, rest) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const L='#c3aee0', l='#9b82c2', K='#1a1a2e', P='#ffb6c1', W='#ffffff', B='#4a3580', Y='#f1c40f', R='#e74c3c';

  if (stage===0) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,6,4,4,3,L);
    d(ctx,6,3,L); d(ctx,9,3,L);
    d(ctx,6,5,K); d(ctx,9,5,K);
    ctx.restore();
  } else if (stage===1) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,6,4,4,3,L);
    f(ctx,6,2,1,2,L); d(ctx,6,3,P);
    f(ctx,9,2,1,2,L); d(ctx,9,3,P);
    d(ctx,6,5,K); d(ctx,9,5,K);
    d(ctx,7,6,P);
    ctx.restore();
  } else if (stage===2) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,5,4,6,4,L);
    f(ctx,5,1,1,3,L); d(ctx,5,2,P);
    f(ctx,10,1,1,3,L); d(ctx,10,2,P);
    d(ctx,6,5,K); d(ctx,9,5,K);
    d(ctx,7,7,P);
    f(ctx,7,8,2,1,l);
    d(ctx,9,8,W);
    ctx.restore();
  } else if (stage===3) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,4,4,8,4,L);
    f(ctx,4,1,1,4,L); d(ctx,4,2,P);
    f(ctx,11,1,1,4,L); d(ctx,11,2,P);
    d(ctx,5,5,K); d(ctx,10,5,K);
    d(ctx,7,7,P);
    f(ctx,5,8,6,2,l);
    f(ctx,6,9,4,1,L);
    d(ctx,11,8,W);
    ctx.restore();
  } else if (stage===4) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,2,4,8,4,L);
    f(ctx,2,0,1,4,L); d(ctx,2,1,P);
    f(ctx,10,0,1,4,L); d(ctx,10,1,P);
    f(ctx,4,2,3,1,B);
    d(ctx,3,5,K); d(ctx,10,5,K);
    d(ctx,6,7,P);
    f(ctx,2,8,8,3,l);
    f(ctx,4,9,4,2,L);
    d(ctx,2,11,P); d(ctx,9,11,P);
    d(ctx,11,8,W);
    ctx.restore();
  } else if (stage===5) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,3,6,10,8,L);
    f(ctx,4,2,1,5,L); d(ctx,4,3,P);
    f(ctx,10,2,1,5,L); d(ctx,10,3,P);
    d(ctx,6,2,l); d(ctx,8,2,l); d(ctx,7,3,l);
    f(ctx,5,7,2,2,K); d(ctx,5,7,W);
    f(ctx,9,7,2,2,K); d(ctx,9,7,W);
    d(ctx,7,9,P); d(ctx,8,9,P); d(ctx,7,10,P);
    d(ctx,3,9,P); d(ctx,3,10,P); d(ctx,12,9,P); d(ctx,12,10,P);
    d(ctx,13,11,W); d(ctx,13,12,W);
    ctx.restore();
  } else if (stage===6) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,3,6,10,8,L);
    f(ctx,4,2,1,5,L); d(ctx,4,3,P);
    f(ctx,10,2,1,5,L); d(ctx,10,3,P);
    d(ctx,6,2,l); d(ctx,8,2,l); d(ctx,7,3,l);
    f(ctx,5,7,2,2,K); d(ctx,5,7,W);
    f(ctx,9,7,2,2,K); d(ctx,9,7,W);
    d(ctx,7,9,P); d(ctx,8,9,P); d(ctx,7,10,P);
    d(ctx,7,11,W);
    d(ctx,3,9,P); d(ctx,3,10,P); d(ctx,12,9,P); d(ctx,12,10,P);
    d(ctx,13,11,W); d(ctx,13,12,W);
    ctx.restore();
  } else if (stage===7) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,3,6,10,8,L);
    f(ctx,4,1,1,6,L); d(ctx,4,2,P);
    f(ctx,10,1,1,6,L); d(ctx,10,2,P);
    d(ctx,6,2,l); d(ctx,8,2,l); d(ctx,7,3,l);
    f(ctx,5,7,2,2,K); d(ctx,5,7,W);
    f(ctx,9,7,2,2,K); d(ctx,9,7,W);
    d(ctx,7,9,P); d(ctx,8,9,P); d(ctx,7,10,P);
    d(ctx,7,11,W); d(ctx,8,11,W);
    d(ctx,3,9,P); d(ctx,3,10,P); d(ctx,12,9,P); d(ctx,12,10,P);
    d(ctx,13,11,W); d(ctx,13,12,W);
    ctx.restore();
  } else if (stage===8) {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,3,6,10,8,L);
    f(ctx,4,1,1,6,L); d(ctx,4,2,P);
    f(ctx,10,1,1,6,L); d(ctx,10,2,P);
    d(ctx,6,2,Y); d(ctx,7,2,Y); d(ctx,8,2,Y); d(ctx,7,2,R);
    f(ctx,6,3,3,1,Y);
    f(ctx,5,7,2,2,K); d(ctx,5,7,W);
    f(ctx,9,7,2,2,K); d(ctx,9,7,W);
    d(ctx,7,9,P); d(ctx,8,9,P); d(ctx,7,10,P);
    d(ctx,7,11,W); d(ctx,8,11,W);
    d(ctx,3,9,P); d(ctx,3,10,P); d(ctx,12,9,P); d(ctx,12,10,P);
    d(ctx,13,11,W); d(ctx,13,12,W);
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate((af===1?2:0)*S, (rest?1:af===2?-1:0)*S);
    f(ctx,2,6,12,8,L);
    f(ctx,4,1,1,6,L); d(ctx,4,2,P);
    f(ctx,10,1,1,6,L); d(ctx,10,2,P);
    d(ctx,5,2,Y); d(ctx,7,2,Y); d(ctx,9,2,Y); d(ctx,7,2,R);
    f(ctx,5,3,5,1,Y);
    f(ctx,5,7,2,2,K); d(ctx,5,7,W);
    f(ctx,9,7,2,2,K); d(ctx,9,7,W);
    d(ctx,7,9,P); d(ctx,8,9,P); d(ctx,7,10,P);
    d(ctx,7,11,W); d(ctx,8,11,W);
    d(ctx,3,9,P); d(ctx,3,10,P); d(ctx,12,9,P); d(ctx,12,10,P);
    f(ctx,14,11,2,2,W);
    ctx.restore();
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
