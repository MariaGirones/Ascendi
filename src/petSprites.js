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
  const O='#f4a35c', o='#c07030', P='#ffb6c1', K='#1a1a2e';
  const eye = (ex, ey) => { d(ctx,ex,ey,K); };

  if (stage <= 4) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);

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
      ctx.globalAlpha=0.4; f(ctx,4,10,8,1,'#f4956a'); ctx.globalAlpha=1.0;
    } else if (stage===3) {
      f(ctx,3,4,10,8,O);
      f(ctx,4,3,3,1,O); d(ctx,5,3,P); d(ctx,5,2,K);
      f(ctx,9,3,3,1,O); d(ctx,10,3,P); d(ctx,10,2,K);
      eye(5,6); eye(9,6);
      f(ctx,7,8,2,1,P);
      ctx.globalAlpha=0.4; f(ctx,4,9,8,3,'#f4956a'); ctx.globalAlpha=1.0;
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
  const G='#e8b84b', g='#c49030', P='#ffb6c1', N='#8B4513', K='#1a1a2e', R='#c0392b';
  const eye = (ex, ey) => { d(ctx, ex, ey, K); };

  if (stage <= 4) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);

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

  const W='#f4f4e4', w='#e0e0d0', ww='#d4d4c0', Gy='#c8c8a8', gy='#909078', Ge='#a0a080';
  const Gy1='#c49030', Gy2='#a8a888', Gy3='#909080', Gy4='#787870',
        Gy5='#686860', Gy6='#585850', Gy7='#484840', Dk='#2a1808';

  if (stage===5) {
    f(ctx,1,4,2,5,g); f(ctx,13,4,2,5,g);
    f(ctx,3,3,10,10,G);
    f(ctx,5,1,6,2,g);
    d(ctx,5,6,K); d(ctx,10,6,K);
    f(ctx,6,8,4,2,'#2a1808');
    f(ctx,3,7,2,2,W); f(ctx,11,7,2,2,W);
    f(ctx,5,9,6,2,w);
    d(ctx,7,11,P); d(ctx,8,11,P);
  } else if (stage===6) {
    f(ctx,1,3,2,7,g); f(ctx,13,3,2,7,g);
    f(ctx,3,2,10,11,G);
    f(ctx,4,0,8,2,g);
    f(ctx,4,5,2,1,g); f(ctx,10,5,2,1,g);
    d(ctx,5,6,K); d(ctx,10,6,K);
    f(ctx,5,8,6,2,'#2a1808');
    f(ctx,2,7,3,3,W); f(ctx,11,7,3,3,W);
    f(ctx,4,10,8,2,W);
    f(ctx,5,12,6,2,w);
    d(ctx,7,11,P); d(ctx,8,11,P);
  } else if (stage===7) {
    f(ctx,1,3,2,5,g); f(ctx,1,7,2,3,Ge);
    f(ctx,13,3,2,5,g); f(ctx,13,7,2,3,Ge);
    f(ctx,3,2,10,11,G);
    f(ctx,3,7,10,6,Gy);
    f(ctx,3,0,10,2,g);
    f(ctx,4,5,3,1,g); f(ctx,9,5,3,1,g);
    d(ctx,5,6,K); d(ctx,10,6,K);
    f(ctx,5,7,6,2,'#1a1008');
    f(ctx,1,6,3,3,W); f(ctx,12,6,3,3,W);
    f(ctx,3,9,10,2,W);
    f(ctx,4,11,8,2,w);
    f(ctx,5,13,6,1,ww);
    d(ctx,7,10,P); d(ctx,8,10,P);
  } else if (stage===8) {
    f(ctx,0,3,2,8,Ge); f(ctx,14,3,2,8,Ge);
    f(ctx,2,2,12,12,Gy);
    f(ctx,3,0,10,2,gy);
    f(ctx,3,5,3,1,gy); f(ctx,10,5,3,1,gy);
    d(ctx,5,5,K); d(ctx,10,5,K);
    f(ctx,5,7,6,3,'#1a1008');
    f(ctx,0,6,3,4,W); f(ctx,13,6,3,4,W);
    f(ctx,3,10,10,3,W);
    f(ctx,4,13,8,2,w);
    f(ctx,5,15,6,1,ww);
    d(ctx,7,11,P); d(ctx,8,11,P);
  } else {
    // Stage 9 — Pastor Catalán gris completo 🐕
    f(ctx,2,3,12,11,Gy5);
    f(ctx,0,3,2,12,Gy6); // left ear floor-length
    f(ctx,14,3,2,12,Gy6); // right ear floor-length
    // massive shaggy top fur — eyes barely visible
    f(ctx,2,0,4,5,Gy7); f(ctx,6,-1,5,6,Gy7); f(ctx,11,0,4,5,Gy7);
    f(ctx,3,3,3,2,Gy6); f(ctx,10,3,3,2,Gy6); // forehead fur
    // eyes peeking under fur
    f(ctx,4,5,2,1,Gy7); f(ctx,10,5,2,1,Gy7); // fur over eyes
    d(ctx,5,5,K); d(ctx,10,5,K);
    f(ctx,6,8,4,2,Dk);   // big dark nose
    // epic full beard
    f(ctx,2,8,4,4,Gy6); f(ctx,10,8,4,4,Gy6);
    f(ctx,3,11,10,2,Gy5);
    f(ctx,4,13,8,2,Gy4);
    // shaggy legs blending into body
    f(ctx,2,12,3,3,Gy6); f(ctx,11,12,3,3,Gy6);
    // tail peek
    f(ctx,14,9,1,4,Gy5);
    if(af===1) f(ctx,6,12,4,2,P);
  }

  ctx.restore();
}

// ─── DRAGON (dark teal/emerald) ───────────────────────────────────────────────
function drawDragon(ctx, stage, af, rest) {
  const D='#1abc9c', dk='#0e8a70', K='#1a1a2e', R='#e74c3c', Y='#f1c40f', W='#ffffff';
  const O='#e8622a', o='#c04b1c', B='#f4956a';
  const RE='#c0392b', re='#a93226', BL='#2980b9', bl='#1a5276', FA='#f39c12';
  const eye=(ex,ey)=>{d(ctx,ex,ey,K);};

  if (stage===0) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,6,8,6,O);
    d(ctx,3,8,o); d(ctx,12,8,o);
    eye(6,8); eye(9,8);
    ctx.restore();
  } else if (stage===3) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,5,8,7,O);
    f(ctx,3,6,1,2,o); f(ctx,12,6,1,2,o);
    d(ctx,8,4,Y);
    eye(6,7); eye(9,7);
    ctx.restore();
  } else if (stage===4) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,4,8,8,RE);
    d(ctx,8,3,Y);
    d(ctx,12,11,re); d(ctx,13,12,re); d(ctx,14,13,re);
    if (af===0) { d(ctx,12,8,FA); d(ctx,13,8,Y); }
    else if (af===1) { d(ctx,12,7,FA); d(ctx,13,7,Y); d(ctx,14,7,'#fff176'); }
    else { d(ctx,12,8,R); d(ctx,13,8,FA); d(ctx,14,8,Y); }
    eye(6,6); eye(9,6);
    ctx.restore();
  } else if (stage===5) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,4,8,8,RE);
    d(ctx,2,5,re); d(ctx,1,6,re); d(ctx,2,6,re); d(ctx,3,6,re); d(ctx,0,7,re); d(ctx,1,7,re); d(ctx,2,7,re); d(ctx,1,5,re);
    d(ctx,13,5,re); d(ctx,14,6,re); d(ctx,13,6,re); d(ctx,12,6,re); d(ctx,15,7,re); d(ctx,14,7,re); d(ctx,13,7,re); d(ctx,14,5,re);
    if (af===0) { d(ctx,12,8,FA); d(ctx,13,8,Y); d(ctx,13,7,R); }
    else if (af===1) { d(ctx,12,7,FA); d(ctx,13,7,FA); d(ctx,14,7,Y); d(ctx,12,8,R); d(ctx,14,8,'#fff176'); }
    else { d(ctx,12,8,R); d(ctx,13,8,FA); d(ctx,14,8,Y); d(ctx,13,7,R); d(ctx,14,7,FA); }
    d(ctx,12,11,re); d(ctx,13,12,re); d(ctx,14,13,re);
    d(ctx,8,3,Y);
    eye(6,6); eye(9,6);
    ctx.restore();
  } else if (stage===6) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,3,8,9,RE);
    d(ctx,2,4,re); d(ctx,1,5,re); d(ctx,2,5,re); d(ctx,3,5,re); d(ctx,0,6,re); d(ctx,1,6,re); d(ctx,2,6,re); d(ctx,3,6,re); d(ctx,0,7,re); d(ctx,1,7,re); d(ctx,2,7,re); d(ctx,1,4,re);
    d(ctx,13,4,re); d(ctx,14,5,re); d(ctx,13,5,re); d(ctx,12,5,re); d(ctx,15,6,re); d(ctx,14,6,re); d(ctx,13,6,re); d(ctx,12,6,re); d(ctx,15,7,re); d(ctx,14,7,re); d(ctx,13,7,re); d(ctx,14,4,re);
    if (af===0) { d(ctx,12,8,FA); d(ctx,13,8,Y); d(ctx,14,8,Y); d(ctx,13,7,R); d(ctx,14,7,FA); d(ctx,14,6,R); }
    else if (af===1) { d(ctx,12,7,R); d(ctx,13,7,FA); d(ctx,14,7,Y); d(ctx,13,6,R); d(ctx,14,6,FA); d(ctx,14,5,'#fff176'); d(ctx,12,8,FA); }
    else { d(ctx,12,8,R); d(ctx,13,8,FA); d(ctx,14,8,FA); d(ctx,14,7,Y); d(ctx,15,7,'#fff176'); d(ctx,13,7,R); d(ctx,15,8,Y); }
    f(ctx,12,11,2,1,re); d(ctx,13,12,re); d(ctx,13,13,re); d(ctx,12,14,re);
    d(ctx,7,1,Y); d(ctx,7,2,Y); d(ctx,9,1,Y); d(ctx,9,2,Y);
    eye(6,5); eye(9,5);
    ctx.restore();
  } else if (stage===7) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,3,8,9,BL);

    d(ctx,2,3,bl); d(ctx,1,4,bl); d(ctx,2,4,bl); d(ctx,3,4,bl); d(ctx,0,5,bl); d(ctx,1,5,bl); d(ctx,2,5,bl); d(ctx,3,5,bl); d(ctx,0,6,bl); d(ctx,1,6,bl); d(ctx,2,6,bl); d(ctx,3,6,bl); d(ctx,1,7,bl); d(ctx,2,7,bl); d(ctx,1,3,bl); d(ctx,0,4,bl);
    d(ctx,13,3,bl); d(ctx,14,4,bl); d(ctx,13,4,bl); d(ctx,12,4,bl); d(ctx,15,5,bl); d(ctx,14,5,bl); d(ctx,13,5,bl); d(ctx,12,5,bl); d(ctx,15,6,bl); d(ctx,14,6,bl); d(ctx,13,6,bl); d(ctx,12,6,bl); d(ctx,14,7,bl); d(ctx,13,7,bl); d(ctx,14,3,bl); d(ctx,15,4,bl);
    d(ctx,12,10,bl); d(ctx,13,11,bl); d(ctx,13,12,bl); d(ctx,12,13,bl); d(ctx,12,14,bl);
    d(ctx,6,0,Y); d(ctx,6,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,7,2,Y);
    d(ctx,9,0,Y); d(ctx,9,1,Y); d(ctx,8,2,Y); d(ctx,9,2,Y); d(ctx,10,2,Y);
    if (af===0) { d(ctx,12,7,R); d(ctx,12,8,R); d(ctx,13,7,FA); d(ctx,13,8,FA); d(ctx,14,7,Y); d(ctx,14,8,Y); d(ctx,14,6,R); d(ctx,13,6,FA); d(ctx,15,7,'#fff176'); d(ctx,11,9,R); d(ctx,12,9,FA); d(ctx,3,8,R); d(ctx,2,9,FA); d(ctx,0,7,R); d(ctx,1,8,FA); }
    else if (af===1) { d(ctx,12,6,R); d(ctx,12,7,R); d(ctx,13,6,FA); d(ctx,13,7,FA); d(ctx,14,6,Y); d(ctx,14,7,'#fff176'); d(ctx,15,6,'#fff176'); d(ctx,12,8,FA); d(ctx,13,8,Y); d(ctx,11,8,R); d(ctx,11,9,FA); d(ctx,2,8,R); d(ctx,3,9,FA); d(ctx,1,7,R); d(ctx,0,8,FA); d(ctx,3,7,FA); }
    else { d(ctx,12,7,R); d(ctx,12,8,FA); d(ctx,13,7,FA); d(ctx,13,8,Y); d(ctx,14,7,Y); d(ctx,14,8,'#fff176'); d(ctx,15,7,Y); d(ctx,15,8,'#fff176'); d(ctx,13,6,R); d(ctx,11,8,R); d(ctx,12,9,R); d(ctx,3,8,FA); d(ctx,2,9,R); d(ctx,0,8,R); d(ctx,1,9,FA); d(ctx,2,7,R); }
    eye(6,5); eye(9,5);
    ctx.restore();
  } else if (stage===8) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,3,8,9,BL);

    d(ctx,2,2,bl); d(ctx,1,3,bl); d(ctx,2,3,bl); d(ctx,0,3,bl); d(ctx,0,4,bl); d(ctx,1,4,bl); d(ctx,2,4,bl); d(ctx,3,4,bl); d(ctx,0,5,bl); d(ctx,1,5,bl); d(ctx,2,5,bl); d(ctx,3,5,bl); d(ctx,0,6,bl); d(ctx,1,6,bl); d(ctx,2,6,bl); d(ctx,3,6,bl); d(ctx,1,7,bl); d(ctx,2,7,bl); d(ctx,3,7,bl); d(ctx,2,8,bl);
    d(ctx,13,2,bl); d(ctx,14,3,bl); d(ctx,13,3,bl); d(ctx,15,3,bl); d(ctx,15,4,bl); d(ctx,14,4,bl); d(ctx,13,4,bl); d(ctx,12,4,bl); d(ctx,15,5,bl); d(ctx,14,5,bl); d(ctx,13,5,bl); d(ctx,12,5,bl); d(ctx,15,6,bl); d(ctx,14,6,bl); d(ctx,13,6,bl); d(ctx,12,6,bl); d(ctx,14,7,bl); d(ctx,13,7,bl); d(ctx,12,7,bl); d(ctx,13,8,bl);
    d(ctx,12,10,bl); d(ctx,13,11,bl); d(ctx,13,12,bl); d(ctx,12,13,bl); d(ctx,11,14,bl); d(ctx,10,14,bl);
    d(ctx,5,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,4,3,Y); d(ctx,5,3,Y); d(ctx,6,3,Y);
    d(ctx,8,1,Y); d(ctx,7,2,Y); d(ctx,8,2,Y); d(ctx,9,2,Y);
    d(ctx,11,1,Y); d(ctx,10,2,Y); d(ctx,11,2,Y); d(ctx,10,3,Y); d(ctx,11,3,Y); d(ctx,12,3,Y);
    if (af===0) { d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,11,8,R); d(ctx,12,4,FA); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,12,8,FA); d(ctx,13,4,Y); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,13,7,Y); d(ctx,14,4,Y); d(ctx,14,5,'#fff176'); d(ctx,14,6,'#fff176'); d(ctx,14,7,'#fff176'); d(ctx,15,5,'#fff176'); d(ctx,15,6,'#fff176'); d(ctx,3,9,R); d(ctx,3,10,FA); d(ctx,0,8,R); d(ctx,1,9,FA); d(ctx,10,10,R); d(ctx,11,10,FA); d(ctx,11,11,Y); d(ctx,3,7,R); d(ctx,2,8,FA); d(ctx,3,9,Y); d(ctx,0,6,R); d(ctx,1,7,FA); d(ctx,0,9,R); d(ctx,1,10,FA); d(ctx,4,10,R); d(ctx,5,11,FA); d(ctx,9,10,R); d(ctx,10,11,FA); }
    else if (af===1) { d(ctx,11,4,R); d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,12,3,R); d(ctx,12,4,FA); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,13,3,FA); d(ctx,13,4,Y); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,14,3,Y); d(ctx,14,4,'#fff176'); d(ctx,14,5,'#fff176'); d(ctx,14,6,'#fff176'); d(ctx,15,4,'#fff176'); d(ctx,15,5,'#fff176'); d(ctx,2,8,R); d(ctx,3,9,FA); d(ctx,1,8,FA); d(ctx,0,9,R); d(ctx,10,9,R); d(ctx,11,9,FA); d(ctx,11,10,Y); d(ctx,2,7,R); d(ctx,3,8,FA); d(ctx,2,9,Y); d(ctx,0,7,R); d(ctx,1,6,FA); d(ctx,1,9,R); d(ctx,0,10,FA); d(ctx,3,10,R); d(ctx,4,11,FA); d(ctx,10,10,R); d(ctx,9,11,FA); d(ctx,5,10,R); }
    else { d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,11,8,R); d(ctx,12,4,R); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,12,8,FA); d(ctx,13,4,FA); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,13,7,Y); d(ctx,14,4,Y); d(ctx,14,5,Y); d(ctx,14,6,'#fff176'); d(ctx,14,7,'#fff176'); d(ctx,15,5,Y); d(ctx,15,6,'#fff176'); d(ctx,15,7,'#fff176'); d(ctx,3,8,R); d(ctx,2,9,FA); d(ctx,0,8,FA); d(ctx,0,9,R); d(ctx,10,10,FA); d(ctx,11,10,R); d(ctx,12,10,FA); d(ctx,11,11,'#fff176'); d(ctx,3,7,FA); d(ctx,2,8,R); d(ctx,3,9,FA); d(ctx,0,6,FA); d(ctx,1,8,R); d(ctx,0,9,FA); d(ctx,1,10,R); d(ctx,5,10,FA); d(ctx,4,11,R); d(ctx,9,10,FA); d(ctx,10,10,R); d(ctx,6,11,FA); }
    eye(6,5); eye(9,5);
    ctx.restore();
  } else {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,3,8,9,'#0a0a0a');
    d(ctx,2,1,'#888'); d(ctx,1,2,'#888'); d(ctx,2,2,'#888'); d(ctx,0,2,'#888'); d(ctx,0,3,'#888'); d(ctx,1,3,'#888'); d(ctx,2,3,'#888'); d(ctx,3,3,'#888'); d(ctx,0,4,'#888'); d(ctx,1,4,'#888'); d(ctx,2,4,'#888'); d(ctx,3,4,'#888'); d(ctx,0,5,'#888'); d(ctx,1,5,'#888'); d(ctx,2,5,'#888'); d(ctx,3,5,'#888'); d(ctx,0,6,'#888'); d(ctx,1,6,'#888'); d(ctx,2,6,'#888'); d(ctx,3,6,'#888'); d(ctx,1,7,'#888'); d(ctx,2,7,'#888'); d(ctx,3,7,'#888'); d(ctx,0,7,'#888'); d(ctx,2,8,'#888'); d(ctx,1,1,'#888');
    d(ctx,13,1,'#888'); d(ctx,14,2,'#888'); d(ctx,13,2,'#888'); d(ctx,15,2,'#888'); d(ctx,15,3,'#888'); d(ctx,14,3,'#888'); d(ctx,13,3,'#888'); d(ctx,12,3,'#888'); d(ctx,15,4,'#888'); d(ctx,14,4,'#888'); d(ctx,13,4,'#888'); d(ctx,12,4,'#888'); d(ctx,15,5,'#888'); d(ctx,14,5,'#888'); d(ctx,13,5,'#888'); d(ctx,12,5,'#888'); d(ctx,15,6,'#888'); d(ctx,14,6,'#888'); d(ctx,13,6,'#888'); d(ctx,12,6,'#888'); d(ctx,14,7,'#888'); d(ctx,13,7,'#888'); d(ctx,12,7,'#888'); d(ctx,15,7,'#888'); d(ctx,13,8,'#888'); d(ctx,14,1,'#888');
    d(ctx,12,10,'#555555'); d(ctx,13,11,'#555555'); d(ctx,13,12,'#555555'); d(ctx,12,13,'#555555'); f(ctx,10,14,2,1,'#555555');
    d(ctx,5,1,Y); d(ctx,5,2,Y); d(ctx,6,2,Y); d(ctx,4,3,Y); d(ctx,5,3,Y); d(ctx,6,3,Y);
    d(ctx,8,1,Y); d(ctx,7,2,Y); d(ctx,8,2,Y); d(ctx,9,2,Y);
    d(ctx,11,1,Y); d(ctx,10,2,Y); d(ctx,11,2,Y); d(ctx,10,3,Y); d(ctx,11,3,Y); d(ctx,12,3,Y);
    if (af===0) {
      d(ctx,10,4,R); d(ctx,11,4,R); d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,11,8,R); d(ctx,12,3,FA); d(ctx,12,4,FA); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,12,8,FA); d(ctx,13,3,Y); d(ctx,13,4,Y); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,13,7,Y); d(ctx,14,3,Y); d(ctx,14,4,'#fff176'); d(ctx,14,5,'#fff176'); d(ctx,14,6,'#fff176'); d(ctx,14,7,'#fff176'); d(ctx,15,4,'#fff176'); d(ctx,15,5,'#fff176'); d(ctx,15,6,'#fff176');
      d(ctx,0,5,R); d(ctx,0,6,FA); d(ctx,0,7,R); d(ctx,1,8,FA); d(ctx,0,9,R); d(ctx,2,9,FA); d(ctx,2,10,Y); d(ctx,3,9,R); d(ctx,3,10,FA); d(ctx,4,10,R);
      d(ctx,10,9,R); d(ctx,10,10,FA); d(ctx,11,9,FA); d(ctx,11,10,Y); d(ctx,11,11,Y); d(ctx,12,10,FA); d(ctx,12,11,'#fff176');
      d(ctx,5,11,R); d(ctx,6,11,FA); d(ctx,8,11,FA); d(ctx,9,11,R);
      d(ctx,3,6,R); d(ctx,2,7,FA); d(ctx,3,8,Y); d(ctx,2,9,FA); d(ctx,3,10,R); d(ctx,1,10,FA); d(ctx,0,8,R); d(ctx,1,9,FA); d(ctx,2,11,R); d(ctx,3,11,FA); d(ctx,4,11,Y); d(ctx,5,12,FA); d(ctx,6,12,R); d(ctx,7,12,FA); d(ctx,8,12,R); d(ctx,9,11,FA); d(ctx,10,11,R); d(ctx,10,12,FA); d(ctx,4,6,R); d(ctx,5,6,FA); d(ctx,0,5,R);
    } else if (af===1) {
      d(ctx,10,3,R); d(ctx,11,3,R); d(ctx,11,4,R); d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,12,2,FA); d(ctx,12,3,FA); d(ctx,12,4,FA); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,13,2,Y); d(ctx,13,3,Y); d(ctx,13,4,Y); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,14,2,Y); d(ctx,14,3,'#fff176'); d(ctx,14,4,'#fff176'); d(ctx,14,5,'#fff176'); d(ctx,14,6,'#fff176'); d(ctx,15,3,'#fff176'); d(ctx,15,4,'#fff176'); d(ctx,15,5,'#fff176');
      d(ctx,0,4,R); d(ctx,0,5,FA); d(ctx,0,6,R); d(ctx,1,7,FA); d(ctx,0,8,R); d(ctx,2,8,FA); d(ctx,2,9,Y); d(ctx,3,8,R); d(ctx,3,9,FA); d(ctx,4,9,R);
      d(ctx,10,8,R); d(ctx,10,9,FA); d(ctx,11,8,FA); d(ctx,11,9,Y); d(ctx,11,10,Y); d(ctx,12,9,FA); d(ctx,12,10,'#fff176');
      d(ctx,5,10,R); d(ctx,6,10,FA); d(ctx,8,10,FA); d(ctx,9,10,R);
      d(ctx,2,6,R); d(ctx,3,7,FA); d(ctx,2,8,Y); d(ctx,3,9,FA); d(ctx,2,10,R); d(ctx,0,9,FA); d(ctx,1,8,R); d(ctx,0,10,FA); d(ctx,1,11,R); d(ctx,2,11,FA); d(ctx,3,12,Y); d(ctx,4,12,FA); d(ctx,5,12,R); d(ctx,7,12,R); d(ctx,8,12,FA); d(ctx,9,12,R); d(ctx,10,10,FA); d(ctx,10,11,R); d(ctx,5,6,R); d(ctx,4,7,FA); d(ctx,0,4,R);
    } else {
      d(ctx,10,4,R); d(ctx,11,4,R); d(ctx,11,5,R); d(ctx,11,6,R); d(ctx,11,7,R); d(ctx,11,8,FA); d(ctx,12,3,R); d(ctx,12,4,FA); d(ctx,12,5,FA); d(ctx,12,6,FA); d(ctx,12,7,FA); d(ctx,12,8,FA); d(ctx,13,3,FA); d(ctx,13,4,Y); d(ctx,13,5,Y); d(ctx,13,6,Y); d(ctx,13,7,Y); d(ctx,14,3,Y); d(ctx,14,4,Y); d(ctx,14,5,'#fff176'); d(ctx,14,6,'#fff176'); d(ctx,14,7,'#fff176'); d(ctx,15,4,Y); d(ctx,15,5,'#fff176'); d(ctx,15,6,'#fff176'); d(ctx,15,7,'#fff176');
      d(ctx,0,5,FA); d(ctx,0,6,R); d(ctx,0,7,FA); d(ctx,1,9,R); d(ctx,2,9,R); d(ctx,2,10,FA); d(ctx,3,10,R); d(ctx,3,11,FA); d(ctx,4,10,FA);
      d(ctx,10,9,FA); d(ctx,10,10,R); d(ctx,11,9,R); d(ctx,11,10,FA); d(ctx,11,11,'#fff176'); d(ctx,12,10,R); d(ctx,12,11,'#fff176');
      d(ctx,5,11,FA); d(ctx,7,11,R); d(ctx,8,11,R); d(ctx,9,11,FA);
      d(ctx,3,6,FA); d(ctx,2,7,R); d(ctx,3,8,FA); d(ctx,2,9,R); d(ctx,3,10,FA); d(ctx,1,9,R); d(ctx,0,8,FA); d(ctx,1,10,R); d(ctx,2,11,FA); d(ctx,3,11,R); d(ctx,4,12,R); d(ctx,5,12,FA); d(ctx,6,12,Y); d(ctx,7,12,R); d(ctx,8,12,FA); d(ctx,9,12,FA); d(ctx,10,11,FA); d(ctx,10,12,R); d(ctx,4,6,FA); d(ctx,5,7,R); d(ctx,0,6,FA);
    }
    d(ctx,6,5,W); d(ctx,9,5,W);
    ctx.restore();
  }
}

// ─── BUNNY (soft lavender) ────────────────────────────────────────────────────
function drawBunny(ctx, stage, af, rest) {
  const L='#c3aee0', l='#9b82c2', K='#1a1a2e', P='#ffb6c1', W='#ffffff', B='#4a3580', Y='#f1c40f', R='#e74c3c';

  if (stage===0) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,6,4,4,3,L);
    d(ctx,6,3,L); d(ctx,9,3,L);
    d(ctx,6,5,K); d(ctx,9,5,K);
    ctx.restore();
  } else if (stage===1) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,6,4,4,3,L);
    f(ctx,6,2,1,2,L); d(ctx,6,3,P);
    f(ctx,9,2,1,2,L); d(ctx,9,3,P);
    d(ctx,6,5,K); d(ctx,9,5,K);
    d(ctx,7,6,P);
    ctx.restore();
  } else if (stage===2) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
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
  } else if (stage===6) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,2,4,8,4,'#d4c0f0');
    f(ctx,2,0,1,4,L); d(ctx,2,1,P);
    f(ctx,10,0,1,4,L); d(ctx,10,1,P);
    f(ctx,4,2,3,1,B);
    d(ctx,3,5,K); d(ctx,10,5,K);
    d(ctx,6,7,P);
    f(ctx,2,8,8,3,l);
    f(ctx,4,9,4,2,L);
    d(ctx,2,11,P); d(ctx,9,11,P);
    d(ctx,11,8,W);
    d(ctx,6,8,W);
    ctx.restore();
  } else if (stage===7) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,2,4,8,4,'#d4c8ee');
    f(ctx,2,0,1,4,'#d4c8ee'); d(ctx,2,1,P);
    f(ctx,10,0,1,4,'#d4c8ee'); d(ctx,10,1,P);
    f(ctx,4,2,3,1,B);
    d(ctx,3,5,K); d(ctx,10,5,K);
    d(ctx,6,7,P);
    f(ctx,2,8,8,3,'#ede6fa');
    f(ctx,4,9,4,2,'#d4c8ee');
    d(ctx,2,11,P); d(ctx,9,11,P);
    d(ctx,11,8,W);
    d(ctx,6,8,W); d(ctx,7,8,W);
    ctx.restore();
  } else if (stage===8) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,2,4,8,4,'#e8e0f8');
    f(ctx,2,0,1,4,'#e8e0f8'); d(ctx,2,1,P);
    f(ctx,10,0,1,4,'#e8e0f8'); d(ctx,10,1,P);
    d(ctx,4,1,Y); d(ctx,5,1,R); d(ctx,6,1,Y);
    f(ctx,4,2,3,1,Y);
    d(ctx,3,5,'#8b0000'); d(ctx,10,5,'#8b0000');
    d(ctx,6,7,P);
    f(ctx,2,8,8,3,l);
    f(ctx,4,9,4,2,'#e8e0f8');
    d(ctx,2,11,P); d(ctx,9,11,P);
    d(ctx,11,8,W);
    d(ctx,6,8,W); d(ctx,7,8,W);
    ctx.restore();
  } else {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,2,4,8,4,W);
    f(ctx,2,0,1,4,W); d(ctx,2,1,P);
    f(ctx,10,0,1,4,W); d(ctx,10,1,P);
    d(ctx,3,1,Y); d(ctx,5,1,R); d(ctx,7,1,Y);
    f(ctx,3,2,5,1,Y);
    d(ctx,3,5,'#cc0000'); d(ctx,10,5,'#cc0000');
    d(ctx,6,7,P);
    f(ctx,2,8,8,3,W);
    f(ctx,4,9,4,2,W);
    d(ctx,2,11,P); d(ctx,9,11,P);
    d(ctx,11,8,W);
    d(ctx,6,8,W); d(ctx,7,8,W);
    ctx.restore();
  }
}

// ─── FOX (orange-red with white) ─────────────────────────────────────────────
function drawFox(ctx, stage, af, rest) {
  const F='#e8622a', fo='#c07030', f2='#f4956a', W='#ffffff', K='#1a1a2e', A='#e8a020', B='#3a1a00', BK='#222';

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
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,6,8,4,4,F);
    d(ctx,7,7,K); d(ctx,9,7,K);
    d(ctx,7,9,K); d(ctx,9,9,K);
    ctx.restore();
  } else if (stage===1) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,5,7,6,5,F);
    f(ctx,6,5,1,2,F); d(ctx,6,5,K);
    f(ctx,9,5,1,2,F); d(ctx,9,5,K);
    f(ctx,6,10,4,2,W);
    d(ctx,6,8,K); d(ctx,9,8,K);
    d(ctx,7,10,K);
    ctx.restore();
  } else if (stage===2) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,7,8,6,F);
    f(ctx,5,4,1,3,F); d(ctx,5,4,K);
    f(ctx,10,4,1,3,F); d(ctx,10,4,K);
    f(ctx,6,10,4,2,W);
    d(ctx,5,8,K); d(ctx,10,8,K);
    d(ctx,7,10,K);
    ctx.restore();
  } else if (stage===3) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,4,6,9,7,F);
    f(ctx,5,2,1,4,F); d(ctx,5,2,K);
    f(ctx,11,2,1,4,F); d(ctx,11,2,K);
    f(ctx,6,10,5,2,W);
    d(ctx,5,8,K); d(ctx,11,8,K);
    d(ctx,8,10,K);
    d(ctx,13,11,W);
    ctx.restore();
  } else if (stage===4) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    f(ctx,3,6,10,7,F);
    f(ctx,4,2,1,4,F); d(ctx,4,2,K);
    f(ctx,12,2,1,4,F); d(ctx,12,2,K);
    f(ctx,6,10,6,2,W);
    d(ctx,5,8,K); d(ctx,11,8,K);
    d(ctx,4,8,fo); d(ctx,12,8,fo);
    d(ctx,8,10,K);
    f(ctx,12,9,2,3,F); d(ctx,11,9,F); d(ctx,11,11,F); d(ctx,12,12,W); d(ctx,13,12,W);
    ctx.restore();
  } else if (stage===5) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    const D5='#d45818';
    f(ctx,2,5,11,9,D5);
    f(ctx,4,1,1,4,D5); d(ctx,4,1,K);
    f(ctx,10,1,1,4,D5); d(ctx,10,1,K);
    f(ctx,4,11,6,2,W);
    d(ctx,4,7,A); d(ctx,10,7,A);
    d(ctx,3,7,fo); d(ctx,11,7,fo);
    d(ctx,7,11,K);
    f(ctx,12,7,2,5,F); d(ctx,11,7,F); d(ctx,11,9,F); d(ctx,11,11,F); f(ctx,12,11,2,2,W); d(ctx,11,12,W);
    ctx.restore();
  } else if (stage===6) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    const D6='#c04010';
    f(ctx,2,4,11,8,D6);
    f(ctx,4,0,1,4,D6); d(ctx,4,0,K);
    f(ctx,10,0,1,4,D6); d(ctx,10,0,K);
    f(ctx,4,9,6,2,W);
    d(ctx,4,6,'#f0a000'); d(ctx,10,6,'#f0a000');
    d(ctx,3,6,fo); d(ctx,11,6,fo);
    d(ctx,7,9,K);
    f(ctx,0,12,16,3,F); d(ctx,1,11,F); d(ctx,3,11,F); d(ctx,5,11,F); d(ctx,7,11,F); d(ctx,9,11,F); d(ctx,11,11,F); d(ctx,13,11,F); f(ctx,1,13,14,1,W);
    f(ctx,1,11,3,2,F); f(ctx,12,11,3,2,F);
    ctx.restore();
  } else if (stage===7) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    const D6='#c04010', A7='#f0a000';
    f(ctx,2,3,11,8,D6);
    f(ctx,4,0,1,3,D6); d(ctx,4,0,K);
    f(ctx,10,0,1,3,D6); d(ctx,10,0,K);
    f(ctx,4,8,6,2,W);
    d(ctx,4,5,A7); d(ctx,10,5,A7);
    d(ctx,3,5,fo); d(ctx,11,5,fo);
    d(ctx,7,8,K);
    f(ctx,0,11,16,4,F); d(ctx,0,10,F); d(ctx,2,10,F); d(ctx,4,10,F); d(ctx,6,10,F); d(ctx,8,10,F); d(ctx,10,10,F); d(ctx,12,10,F); d(ctx,14,10,F); f(ctx,1,12,14,2,W);
    f(ctx,1,10,3,2,F); f(ctx,12,10,3,2,F);
    ctx.restore();
  } else if (stage===8) {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    const D8='#3a1a10', C8='#f0e0c0', Y8='#f1c40f';
    f(ctx,1,3,12,8,D8);
    f(ctx,3,0,1,3,D8); d(ctx,3,0,K);
    f(ctx,10,0,1,3,D8); d(ctx,10,0,K);
    f(ctx,3,8,8,3,C8);
    d(ctx,3,5,Y8); d(ctx,10,5,Y8);
    d(ctx,4,5,W); d(ctx,11,5,W);
    d(ctx,6,8,K);
    f(ctx,0,11,16,4,W); d(ctx,0,10,W); d(ctx,2,10,W); d(ctx,4,9,W); d(ctx,6,10,W); d(ctx,8,9,W); d(ctx,10,10,W); d(ctx,12,10,W); d(ctx,14,10,W); f(ctx,0,14,16,1,Y8);
    f(ctx,1,10,3,2,D8); f(ctx,12,10,3,2,D8);
    ctx.restore();
  } else {
    ctx.save();
    const xo=af===1?2:0, yo=rest?1:af===2?-1:0; ctx.translate(xo*S,yo*S);
    const D9='#1a0a08', C9='#f0e0c0', Y9='#f1c40f';
    f(ctx,1,2,12,8,D9);
    f(ctx,3,0,1,2,D9); d(ctx,3,0,K);
    f(ctx,9,0,1,2,D9); d(ctx,9,0,K);
    f(ctx,3,7,7,3,C9);
    d(ctx,3,4,Y9); d(ctx,9,4,Y9);
    d(ctx,4,4,W); d(ctx,10,4,W);
    d(ctx,6,7,K);
    f(ctx,0,10,16,5,W); d(ctx,0,9,W); d(ctx,2,8,W); d(ctx,4,9,W); d(ctx,6,8,W); d(ctx,8,8,W); d(ctx,10,9,W); d(ctx,12,8,W); d(ctx,14,9,W); d(ctx,15,9,W); d(ctx,3,11,W); d(ctx,7,11,W); d(ctx,11,11,W); f(ctx,0,14,16,2,Y9);
    f(ctx,1,9,3,2,D9); f(ctx,12,9,3,2,D9);
    ctx.restore();
  }
}

// ─── AXOLOTL (pink, external gills) ──────────────────────────────────────────
function drawAxolotl(ctx, stage, af, rest) {
  const A='#ff91b0', a='#e0607a', K='#1a1a2e', G='#ff4466';

  if (stage===0) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // Egg
    f(ctx,5+xo,3+yo,6,8,'#ffcce0');
    f(ctx,4+xo,4+yo,8,6,'#ffcce0');
    // Outline
    f(ctx,5+xo,3+yo,6,1,K); f(ctx,5+xo,10+yo,6,1,K);
    f(ctx,4+xo,4+yo,1,6,K); f(ctx,11+xo,4+yo,1,6,K);
    // Inner
    f(ctx,6+xo,4+yo,4,6,'#ffd6e7');
    // Shine
    d(ctx,6+xo,4+yo,'#ffffff'); d(ctx,7+xo,4+yo,'#ffffff');
    // Spots
    d(ctx,8+xo,6+yo,a); d(ctx,6+xo,8+yo,a);
  } else if (stage===1) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // Tiny gills
    f(ctx,1+xo,7+yo,1,2,A); f(ctx,14+xo,7+yo,1,2,A);
    d(ctx,1+xo,7+yo,'#ffb6c1'); d(ctx,14+xo,7+yo,'#ffb6c1');
    // Body
    f(ctx,3+xo,6+yo,10,6,A);
    f(ctx,3+xo,6+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,6+yo,1,6,K); f(ctx,12+xo,6+yo,1,6,K);
    f(ctx,4+xo,7+yo,8,4,'#ffcce0');
    // Eyes
    d(ctx,5+xo,8+yo,K); d(ctx,10+xo,8+yo,K);
    // Nose
    d(ctx,7+xo,10+yo,a); d(ctx,8+xo,10+yo,a);
    // Tail
    f(ctx,5+xo,12+yo,6,2,'#ffd6e7');
    f(ctx,6+xo,13+yo,4,1,'#ffd6e7');
    f(ctx,5+xo,14+yo,6,1,A);
  } else if (stage===2) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // 2 gills left
    f(ctx,1+xo,7+yo,1,3,a); d(ctx,1+xo,7+yo,'#ffb6c1');
    f(ctx,2+xo,6+yo,1,4,a); d(ctx,2+xo,6+yo,'#ffb6c1');
    // 2 gills right
    f(ctx,13+xo,7+yo,1,3,a); d(ctx,13+xo,7+yo,'#ffb6c1');
    f(ctx,14+xo,6+yo,1,4,a); d(ctx,14+xo,6+yo,'#ffb6c1');
    // Fin
    f(ctx,4+xo,3+yo,8,2,G);
    d(ctx,5+xo,2+yo,G); d(ctx,8+xo,1+yo,G); d(ctx,8+xo,2+yo,G); d(ctx,11+xo,2+yo,G);
    // Body
    f(ctx,2+xo,5+yo,12,7,A);
    f(ctx,2+xo,5+yo,12,1,K); f(ctx,2+xo,11+yo,12,1,K);
    f(ctx,2+xo,5+yo,1,7,K); f(ctx,13+xo,5+yo,1,7,K);
    f(ctx,3+xo,6+yo,10,5,'#ffcce0');
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,a); d(ctx,8+xo,9+yo,a);
    // Leg nubs
    f(ctx,2+xo,12+yo,2,1,A); f(ctx,12+xo,12+yo,2,1,A);
    // Tail
    f(ctx,4+xo,12+yo,8,2,'#ffd6e7');
    f(ctx,5+xo,13+yo,6,1,'#ffd6e7');
    f(ctx,4+xo,14+yo,8,1,A);
  } else if (stage===3) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // 3 gills left
    f(ctx,0+xo,7+yo,1,3,a); d(ctx,0+xo,7+yo,'#ffb6c1');
    f(ctx,1+xo,6+yo,1,4,a); d(ctx,1+xo,6+yo,'#ffb6c1');
    f(ctx,2+xo,6+yo,1,4,a); d(ctx,2+xo,6+yo,'#ffb6c1');
    // 3 gills right
    f(ctx,15+xo,7+yo,1,3,a); d(ctx,15+xo,7+yo,'#ffb6c1');
    f(ctx,14+xo,6+yo,1,4,a); d(ctx,14+xo,6+yo,'#ffb6c1');
    f(ctx,13+xo,6+yo,1,4,a); d(ctx,13+xo,6+yo,'#ffb6c1');
    // Fin
    f(ctx,3+xo,2+yo,10,3,G);
    d(ctx,4+xo,1+yo,G); d(ctx,8+xo,0+yo,G); d(ctx,8+xo,1+yo,G); d(ctx,12+xo,1+yo,G);
    // Body
    f(ctx,2+xo,5+yo,12,7,A);
    f(ctx,2+xo,5+yo,12,1,K); f(ctx,2+xo,11+yo,12,1,K);
    f(ctx,2+xo,5+yo,1,7,K); f(ctx,13+xo,5+yo,1,7,K);
    f(ctx,3+xo,6+yo,10,5,'#ffcce0');
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,a); d(ctx,8+xo,9+yo,a);
    // 4 legs
    f(ctx,2+xo,11+yo,2,1,A); f(ctx,12+xo,11+yo,2,1,A);
    f(ctx,2+xo,12+yo,2,1,A); f(ctx,12+xo,12+yo,2,1,A);
    // Tail
    f(ctx,3+xo,12+yo,10,2,'#ffd6e7');
    f(ctx,4+xo,13+yo,8,1,'#ffd6e7');
    f(ctx,3+xo,14+yo,10,1,A);
  } else if (stage===4) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // 3 gills left taller
    f(ctx,0+xo,6+yo,1,5,a); d(ctx,0+xo,6+yo,'#ffb6c1');
    f(ctx,1+xo,5+yo,1,6,a); d(ctx,1+xo,5+yo,'#ffb6c1');
    f(ctx,2+xo,6+yo,1,5,a); d(ctx,2+xo,6+yo,'#ffb6c1');
    // 3 gills right taller
    f(ctx,15+xo,6+yo,1,5,a); d(ctx,15+xo,6+yo,'#ffb6c1');
    f(ctx,14+xo,5+yo,1,6,a); d(ctx,14+xo,5+yo,'#ffb6c1');
    f(ctx,13+xo,6+yo,1,5,a); d(ctx,13+xo,6+yo,'#ffb6c1');
    // Fin 3 spikes
    f(ctx,3+xo,2+yo,10,3,G);
    f(ctx,4+xo,0+yo,2,3,G); f(ctx,8+xo,0+yo,2,3,G); f(ctx,12+xo,0+yo,2,3,G);
    // Body
    f(ctx,2+xo,5+yo,12,7,A);
    f(ctx,2+xo,5+yo,12,1,K); f(ctx,2+xo,11+yo,12,1,K);
    f(ctx,2+xo,5+yo,1,7,K); f(ctx,13+xo,5+yo,1,7,K);
    f(ctx,3+xo,6+yo,10,5,'#ffcce0');
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,a); d(ctx,8+xo,9+yo,a);
    // Legs
    f(ctx,2+xo,11+yo,2,2,A); f(ctx,12+xo,11+yo,2,2,A);
    // Tail
    f(ctx,3+xo,12+yo,10,2,'#ffd6e7');
    f(ctx,4+xo,13+yo,8,2,'#ffd6e7');
    f(ctx,3+xo,14+yo,10,1,A);
  } else if (stage===5) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    // 4 gills left
    f(ctx,0+xo,5+yo,1,6,a); d(ctx,0+xo,5+yo,'#ffb6c1');
    f(ctx,1+xo,4+yo,1,7,a); d(ctx,1+xo,4+yo,'#ffb6c1');
    f(ctx,2+xo,5+yo,1,6,a); d(ctx,2+xo,5+yo,'#ffb6c1');
    f(ctx,3+xo,6+yo,1,5,a); d(ctx,3+xo,6+yo,'#ffb6c1');
    // 4 gills right
    f(ctx,15+xo,5+yo,1,6,a); d(ctx,15+xo,5+yo,'#ffb6c1');
    f(ctx,14+xo,4+yo,1,7,a); d(ctx,14+xo,4+yo,'#ffb6c1');
    f(ctx,13+xo,5+yo,1,6,a); d(ctx,13+xo,5+yo,'#ffb6c1');
    f(ctx,12+xo,6+yo,1,5,a); d(ctx,12+xo,6+yo,'#ffb6c1');
    // Fin 4 spikes
    f(ctx,3+xo,2+yo,10,3,G);
    f(ctx,4+xo,0+yo,2,3,G); f(ctx,7+xo,0+yo,2,3,G);
    f(ctx,10+xo,0+yo,2,3,G); f(ctx,13+xo,0+yo,2,3,G);
    // Body
    f(ctx,3+xo,5+yo,10,7,A);
    f(ctx,3+xo,5+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,5+yo,1,7,K); f(ctx,12+xo,5+yo,1,7,K);
    f(ctx,4+xo,6+yo,8,5,'#ffcce0');
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,a); d(ctx,8+xo,9+yo,a);
    // Legs
    f(ctx,3+xo,11+yo,2,2,A); f(ctx,11+xo,11+yo,2,2,A);
    // Tail
    f(ctx,4+xo,12+yo,8,2,'#ffd6e7');
    f(ctx,5+xo,13+yo,6,1,'#ffd6e7');
    f(ctx,4+xo,14+yo,8,1,A);
  } else if (stage===6) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    const B='#c3aee0', b='#9b82c2', Bv='#ddd0f0', Gv='#7b62a2';
    // 4 gills left
    f(ctx,0+xo,5+yo,1,6,b); d(ctx,0+xo,5+yo,'#e0d4f5');
    f(ctx,1+xo,4+yo,1,7,b); d(ctx,1+xo,4+yo,'#e0d4f5');
    f(ctx,2+xo,5+yo,1,6,b); d(ctx,2+xo,5+yo,'#e0d4f5');
    f(ctx,3+xo,6+yo,1,5,b); d(ctx,3+xo,6+yo,'#e0d4f5');
    // 4 gills right
    f(ctx,15+xo,5+yo,1,6,b); d(ctx,15+xo,5+yo,'#e0d4f5');
    f(ctx,14+xo,4+yo,1,7,b); d(ctx,14+xo,4+yo,'#e0d4f5');
    f(ctx,13+xo,5+yo,1,6,b); d(ctx,13+xo,5+yo,'#e0d4f5');
    f(ctx,12+xo,6+yo,1,5,b); d(ctx,12+xo,6+yo,'#e0d4f5');
    // Fin lavender
    f(ctx,3+xo,2+yo,10,3,Gv);
    f(ctx,4+xo,0+yo,2,3,Gv); f(ctx,7+xo,0+yo,2,3,Gv);
    f(ctx,10+xo,0+yo,2,3,Gv); f(ctx,13+xo,0+yo,2,3,Gv);
    // Body lavender
    f(ctx,3+xo,5+yo,10,7,B);
    f(ctx,3+xo,5+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,5+yo,1,7,K); f(ctx,12+xo,5+yo,1,7,K);
    f(ctx,4+xo,6+yo,8,5,Bv);
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,b); d(ctx,8+xo,9+yo,b);
    // Legs
    f(ctx,3+xo,11+yo,2,2,B); f(ctx,11+xo,11+yo,2,2,B);
    // Tail
    ctx.globalAlpha = 0.35;
    f(ctx, 4+xo, 12+yo, 8, 2, '#c3aee0');
    f(ctx, 5+xo, 13+yo, 6, 1, '#c3aee0');
    ctx.globalAlpha = 1.0;
    f(ctx,4+xo,14+yo,8,1,B);
  } else if (stage===7) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    const Bl='#60a0e0', bl='#4080d0', Blv='#a0c8f0', Gbl='#2060b0';
    // 4 gills left
    f(ctx,0+xo,5+yo,1,6,bl); d(ctx,0+xo,5+yo,'#80b0f0');
    f(ctx,1+xo,4+yo,1,7,bl); d(ctx,1+xo,4+yo,'#80b0f0');
    f(ctx,2+xo,5+yo,1,6,bl); d(ctx,2+xo,5+yo,'#80b0f0');
    f(ctx,3+xo,6+yo,1,5,bl); d(ctx,3+xo,6+yo,'#80b0f0');
    // 4 gills right
    f(ctx,15+xo,5+yo,1,6,bl); d(ctx,15+xo,5+yo,'#80b0f0');
    f(ctx,14+xo,4+yo,1,7,bl); d(ctx,14+xo,4+yo,'#80b0f0');
    f(ctx,13+xo,5+yo,1,6,bl); d(ctx,13+xo,5+yo,'#80b0f0');
    f(ctx,12+xo,6+yo,1,5,bl); d(ctx,12+xo,6+yo,'#80b0f0');
    // Fin blue + crown
    f(ctx,3+xo,2+yo,10,3,Gbl);
    f(ctx,4+xo,0+yo,2,3,Gbl); f(ctx,7+xo,0+yo,2,3,Gbl);
    f(ctx,10+xo,0+yo,2,3,Gbl); f(ctx,13+xo,0+yo,2,3,Gbl);
    d(ctx,5+xo,0+yo,'#f1c40f'); d(ctx,8+xo,0+yo,'#f1c40f');
    d(ctx,11+xo,0+yo,'#f1c40f'); d(ctx,8+xo,1+yo,'#e74c3c');
    // Body blue
    f(ctx,3+xo,5+yo,10,7,Bl);
    f(ctx,3+xo,5+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,5+yo,1,7,K); f(ctx,12+xo,5+yo,1,7,K);
    f(ctx,4+xo,6+yo,8,5,Blv);
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,bl); d(ctx,8+xo,9+yo,bl);
    // Legs
    f(ctx,3+xo,11+yo,2,2,Bl); f(ctx,11+xo,11+yo,2,2,Bl);
    // Tail
    ctx.globalAlpha = 0.35;
    f(ctx, 4+xo, 12+yo, 8, 2, '#60a0e0');
    f(ctx, 5+xo, 13+yo, 6, 2, '#60a0e0');
    f(ctx, 6+xo, 14+yo, 4, 1, '#60a0e0');
    ctx.globalAlpha = 0.2;
    f(ctx, 5+xo, 15+yo, 6, 1, '#60a0e0');
    ctx.globalAlpha = 1.0;
  } else if (stage===8) {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    const T='#1abc9c', t='#0e8a70', Tv='#a8ffe8', Gt='#0e8a70';
    // 4 gills left
    f(ctx,0+xo,5+yo,1,6,t); d(ctx,0+xo,5+yo,'#a8ffe8');
    f(ctx,1+xo,4+yo,1,7,t); d(ctx,1+xo,4+yo,'#a8ffe8');
    f(ctx,2+xo,5+yo,1,6,t); d(ctx,2+xo,5+yo,'#a8ffe8');
    f(ctx,3+xo,6+yo,1,5,t); d(ctx,3+xo,6+yo,'#a8ffe8');
    // 4 gills right
    f(ctx,15+xo,5+yo,1,6,t); d(ctx,15+xo,5+yo,'#a8ffe8');
    f(ctx,14+xo,4+yo,1,7,t); d(ctx,14+xo,4+yo,'#a8ffe8');
    f(ctx,13+xo,5+yo,1,6,t); d(ctx,13+xo,5+yo,'#a8ffe8');
    f(ctx,12+xo,6+yo,1,5,t); d(ctx,12+xo,6+yo,'#a8ffe8');
    // Fin teal + crown
    f(ctx,3+xo,2+yo,10,3,Gt);
    f(ctx,4+xo,0+yo,2,3,Gt); f(ctx,7+xo,0+yo,2,3,Gt);
    f(ctx,10+xo,0+yo,2,3,Gt); f(ctx,13+xo,0+yo,2,3,Gt);
    d(ctx,5+xo,0+yo,'#f1c40f'); d(ctx,8+xo,0+yo,'#f1c40f');
    d(ctx,11+xo,0+yo,'#f1c40f'); d(ctx,8+xo,1+yo,'#e74c3c');
    // Body teal
    f(ctx,3+xo,5+yo,10,7,T);
    f(ctx,3+xo,5+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,5+yo,1,7,K); f(ctx,12+xo,5+yo,1,7,K);
    f(ctx,4+xo,6+yo,8,5,Tv);
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,t); d(ctx,8+xo,9+yo,t);
    // Legs
    f(ctx,3+xo,11+yo,2,2,T); f(ctx,11+xo,11+yo,2,2,T);
    // Tail
    ctx.globalAlpha = 0.4;
    f(ctx, 3+xo, 12+yo, 10, 2, '#1abc9c');
    ctx.globalAlpha = 0.3;
    f(ctx, 4+xo, 13+yo, 8, 2, '#1abc9c');
    ctx.globalAlpha = 0.2;
    f(ctx, 5+xo, 14+yo, 6, 1, '#1abc9c');
    f(ctx, 6+xo, 15+yo, 4, 1, '#1abc9c');
    ctx.globalAlpha = 1.0;
  } else {
    const xo=af===1?2:0, yo=af===2?-1:rest?1:0;
    const Gl='#e8b84b', gl='#c49030', Glv='#f0d080', Gg='#c49030';
    // Stars
    d(ctx, 1+xo,  0+yo, '#ffffff'); d(ctx, 0+xo,  2+yo, '#f1c40f');
    d(ctx,15+xo,  0+yo, '#f1c40f'); d(ctx,15+xo,  3+yo, '#ffffff');
    d(ctx, 0+xo, 13+yo, '#f1c40f'); d(ctx, 1+xo, 15+yo, '#ffffff');
    d(ctx,15+xo, 13+yo, '#ffffff'); d(ctx,14+xo, 15+yo, '#f1c40f');
    // 4 gills left gold
    f(ctx,0+xo,5+yo,1,6,gl); d(ctx,0+xo,5+yo,'#f1c40f');
    f(ctx,1+xo,4+yo,1,7,gl); d(ctx,1+xo,4+yo,'#f1c40f');
    f(ctx,2+xo,5+yo,1,6,gl); d(ctx,2+xo,5+yo,'#f1c40f');
    f(ctx,3+xo,6+yo,1,5,gl); d(ctx,3+xo,6+yo,'#f1c40f');
    // 4 gills right gold
    f(ctx,15+xo,5+yo,1,6,gl); d(ctx,15+xo,5+yo,'#f1c40f');
    f(ctx,14+xo,4+yo,1,7,gl); d(ctx,14+xo,4+yo,'#f1c40f');
    f(ctx,13+xo,5+yo,1,6,gl); d(ctx,13+xo,5+yo,'#f1c40f');
    f(ctx,12+xo,6+yo,1,5,gl); d(ctx,12+xo,6+yo,'#f1c40f');
    // Fin gold + big crown
    f(ctx,3+xo,2+yo,10,3,Gg);
    f(ctx,4+xo,0+yo,2,3,Gg); f(ctx,7+xo,0+yo,2,3,Gg);
    f(ctx,10+xo,0+yo,2,3,Gg); f(ctx,13+xo,0+yo,2,3,Gg);
    f(ctx,4+xo,0+yo,2,1,'#f1c40f'); f(ctx,7+xo,0+yo,2,1,'#f1c40f');
    f(ctx,10+xo,0+yo,2,1,'#f1c40f'); f(ctx,13+xo,0+yo,2,1,'#f1c40f');
    d(ctx,8+xo,0+yo,'#e74c3c'); d(ctx,8+xo,1+yo,'#e74c3c');
    // Cheek marks
    d(ctx,4+xo,9+yo,gl); d(ctx,11+xo,9+yo,gl);
    // Body gold
    f(ctx,3+xo,5+yo,10,7,Gl);
    f(ctx,3+xo,5+yo,10,1,K); f(ctx,3+xo,11+yo,10,1,K);
    f(ctx,3+xo,5+yo,1,7,K); f(ctx,12+xo,5+yo,1,7,K);
    f(ctx,4+xo,6+yo,8,5,Glv);
    // Eyes
    d(ctx,5+xo,7+yo,K); d(ctx,10+xo,7+yo,K);
    // Nose
    d(ctx,7+xo,9+yo,gl); d(ctx,8+xo,9+yo,gl);
    // Legs
    f(ctx,3+xo,11+yo,2,2,Gl); f(ctx,11+xo,11+yo,2,2,Gl);
    // Tail
    ctx.globalAlpha = 0.45;
    f(ctx, 3+xo, 12+yo, 10, 2, '#e8b84b');
    ctx.globalAlpha = 0.35;
    f(ctx, 4+xo, 13+yo, 8, 2, '#e8b84b');
    ctx.globalAlpha = 0.25;
    f(ctx, 5+xo, 14+yo, 6, 2, '#e8b84b');
    ctx.globalAlpha = 0.15;
    f(ctx, 6+xo, 15+yo, 4, 1, '#e8b84b');
    f(ctx, 7+xo, 16+yo, 2, 1, '#e8b84b');
    ctx.globalAlpha = 1.0;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

const DRAW_FUNCTIONS = { cat: drawCat, dog: drawDog, dragon: drawDragon, bunny: drawBunny, fox: drawFox, axolotl: drawAxolotl };

export function drawPet(ctx, petId, stage, animFrame, isResting, bgColor) {
  const size = Math.min(ctx.canvas.width, ctx.canvas.height);
  S = Math.max(1, Math.floor(size * 0.65 / 16));
  PAD = Math.round((size - S * 16) / 2);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); }
  const fn = DRAW_FUNCTIONS[petId];
  if (fn) fn(ctx, stage, animFrame, isResting);
}
