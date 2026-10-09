const card = document.querySelector('#card');
const newsletter = document.querySelector('#newsletter');
const openCard = document.querySelector('#open-card');
const area = document.querySelector('#balloon-area');
const progress = document.querySelector('#progress');
const totalLabel = document.querySelector('#balloon-total');
const finale = document.querySelector('#finale');
const colors = ['#ef594c','#5366df','#f4af2f','#34aa9b','#aa63ce','#ee7b39'];
let target = 23, popped = 0, audioCtx, soundOn = false;

openCard.addEventListener('click', () => {
  newsletter.classList.add('hidden'); card.classList.remove('hidden');
  launchConfetti(130); buildBalloons(); window.scrollTo({top:0, behavior:'smooth'});
});

function buildBalloons() {
  target = 23; popped = 0; area.innerHTML = ''; finale.classList.add('hidden');
  totalLabel.textContent = target; progress.textContent = `0 / ${target} popped`;
  const box = area.getBoundingClientRect();
  const isMobile = box.width < 600;
  const size = Math.max(isMobile ? 39 : 58, Math.min(isMobile ? 64 : 100, (box.width / Math.sqrt(target * 1.25)) * .72));
  const placed = [];
  for (let i=0; i<target; i++) {
    const balloon = document.createElement('button'); balloon.className = 'balloon'; balloon.setAttribute('aria-label', 'Pop balloon');
    let x, y, tries = 0;
    do { x = 10 + Math.random() * Math.max(1, box.width - size - 22); y = 8 + Math.random() * Math.max(1, box.height - size * 2.05); tries++; }
    while (tries < 90 && placed.some(point => Math.hypot(point.x - x, point.y - y) < size * .72));
    placed.push({ x, y });
    const color = colors[i % colors.length];
    balloon.style.left = `${x}px`; balloon.style.top = `${y}px`; balloon.style.setProperty('--size', `${size}px`); balloon.style.setProperty('--balloon-color', color);
    balloon.style.setProperty('--duration', `${2.4 + Math.random() * 2.6}s`); balloon.style.setProperty('--delay', `${-Math.random() * 3}s`); balloon.style.setProperty('--drift-x', `${-10 + Math.random() * 20}px`); balloon.style.setProperty('--drift-y', `${-12 + Math.random() * 24}px`);
    balloon.innerHTML = '<span class="balloon-body"></span><span class="balloon-knot"></span><svg class="balloon-string" viewBox="0 0 100 70" aria-hidden="true"><path d="M50 0 C24 19 82 34 47 67" /></svg>';
    balloon.addEventListener('click', () => pop(balloon)); area.appendChild(balloon);
  }
}
function pop(balloon) {
  if (balloon.classList.contains('pop')) return; balloon.classList.add('pop'); popped++; if (soundOn) playPop(); launchConfetti(10, balloon.getBoundingClientRect());
  progress.textContent = `${popped} / ${target} popped`;
  if (popped === target) { setTimeout(() => { finale.classList.remove('hidden'); launchConfetti(180); finale.scrollIntoView({behavior:'smooth',block:'center'}); }, 400); }
}
document.querySelector('#replay').addEventListener('click', () => { buildBalloons(); document.querySelector('#balloon-game').scrollIntoView({behavior:'smooth'}); });
function launchConfetti(amount, origin) { for(let i=0;i<amount;i++) { const piece=document.createElement('i'); piece.className='confetti'; piece.style.background=colors[i%colors.length]; piece.style.left=`${origin ? origin.left + origin.width/2 : Math.random()*innerWidth}px`; piece.style.top=`${origin ? origin.top + origin.height/2 : -15}px`; piece.style.setProperty('--drift', `${-180 + Math.random()*360}px`); document.querySelector('#confetti').appendChild(piece); setTimeout(()=>piece.remove(),1900); } }
function playPop() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.setValueAtTime(220, audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime+.11); g.gain.setValueAtTime(.04,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.12); o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+.12); }
document.querySelector('#sound-toggle').addEventListener('click', e => { soundOn = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', soundOn); if(soundOn) playPop(); });
